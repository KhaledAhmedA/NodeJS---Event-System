const { validationResult } = require("express-validator");

const Event = require("./../models/eventSchema");

exports.getAllEvents = (request, response) => {


    Event.find({})
        .then(data => {
            response.status(200).json(data)
        })
        .catch(error => {
            next(error);
        })
}

exports.getEvent = (request, response) => {
    Event.find({ _id: request.params.id })
        .then(data => {
            response.status(200).json(data)
        })
        .catch(error => {
            next(error);
        })

}

exports.addEvent = (request, response, next) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
        let error = new Error();
        error.status = 422;
        error.message = errors.array().reduce((current, object) => current + object.msg + " ", "")
        throw error;
    }

    if (request.role == "administrator") {
        let eventObj = new Event({
            _id: request.body.id,
            title: request.body.title,
            date: request.body.eventDate,
            mainspeaker: request.body.mainSpeaker,
            speakers: request.body.speakers,
            students: request.body.students
        })

        eventObj.save()
            .then(data => {
                response.status(201).json({ message: "added", data })
            })
            .catch(error => next(error))
    }
    else {
        throw new Error("Not Authorized. Only Admin can do that");
    }



    // response.status(200).json({ data: "Event Added" })
}

exports.updateEvent = (request, response) => {


    let errors = validationResult(request);
    if (!errors.isEmpty()) {
        let error = new Error();
        error.status = 422;
        error.message = errors.array().reduce((current, object) => current + object.msg + " ", "")
        throw error;
    }
    if (request.role == "administrator") {
        Event.findByIdAndUpdate(request.body.id, {
            $set: {
                title: request.body.title,
                date: request.body.eventDate,
                mainspeaker: request.body.mainSpeaker,
                speakers: request.body.speakers,
                students: request.body.students
            }
        })
            .then(data => {
                if (data == null) throw new Error("event not found");
                response.status(200).json({ message: "Updated", data })
            })
            .catch(error => next(error))
    }
    else {
        throw new Error("Not Authorized. Only admin do that");
    }

    // response.status(200).json({ data: "Event Updated" })
}


exports.deleteEvent = (request, response) => {

    let errors = validationResult(request);
    if (!errors.isEmpty()) {
        let error = new Error();
        error.status = 422;
        error.message = errors.array().reduce((current, object) => current + object.msg + " ", "")
        throw error;
    }

    if (request.role == "administrator") {
        Event.findByIdAndDelete(request.body.id)
            .then(data => {
                if (data == null) throw new Error("student Is not Found!")
                response.status(200).json({ message: "deleted" })

            })
            .catch(error => next(error))
    }
    else {
        throw new Error("Not Authorized. only admin can do that");
    }

    // response.status(200).json({ data: "Event Deleted" })
}

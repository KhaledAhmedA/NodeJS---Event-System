const mongoose = require("mongoose");
// const autoIncrement = require('mongoose-auto-increment'); //OLD
const AutoIncrement = require('mongoose-sequence')(mongoose);

// autoIncrement.initialize(mongoose.connection);
const schema = new mongoose.Schema({

    _id: Number,
    title: String,
    date: String,
    mainspeaker: {
        type: mongoose.Types.ObjectId,
        ref: "speakers"
    },

    speakers: [{ type: mongoose.Types.ObjectId, ref: "speakers" }],
    students: [{ type: Number, ref: "students" }]

})
schema.plugin(AutoIncrement, { id: "event_id" });
// schema.plugin(autoIncrement.plugin, "event");
module.exports = mongoose.model("event", schema);

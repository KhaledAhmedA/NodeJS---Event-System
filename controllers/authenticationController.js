const { validationResult } = require("express-validator");
const { append } = require("express/lib/response");
const axios = require('axios');
const jwt = require("jsonwebtoken");
const User = require("./../models/userSchema");
const Speaker = require("./../models/speakerSchema");
const Student = require("./../models/studentSchema");
// const req = require("express/lib/request");
const bcrypt = require("bcrypt");


require("dotenv").config();
exports.login = (request, response, next) => {

  let errors = validationResult(request);
  if (!errors.isEmpty()) {
    let error = new Error();
    error.status = 422;
    error.message = errors.array().reduce((current, object) => current + object.msg + " ", "")
    throw error;
  }

  User.findOne({ username: request.body.username, password: request.body.password })
    .then(data => {
      if (data == null)
        throw new Error("username or password is incorrect");

      // console.log(data)  
      // if(data.userType=="administrator")
      // {
      //   let token = jwt.sign({
      //     username:request.body.username,

      //   },"ITI",{expiresIn:"10h"})

      //   response.status(200).json({message:"Login Success",data,token})
      // }

      //NO DATABASE
      // if (request.body.username == "admin" && request.body.paswword =="admin") {
      //   let token = jwt.sign({
      //     username: request.body.username,
      //     role: "administrator"
      //   }, process.env.SECRET_KEY, { expiresIn: "10h" })
      // }

      // if( request.body.username == "speaker")
      // {
      //   let token = jwt.sign({
      //     username: request.body.username,
      //     role: "speaker"
      //   }, process.env.SECRET_KEY, { expiresIn: "10h" })
      // }

      // if( request.body.username == "studnt")
      // {
      //   let token = jwt.sign({
      //     username: request.body.username,
      //     role: "student"
      //   }, process.env.SECRET_KEY, { expiresIn: "10h" })
      // }




      // console.log("data.role",data.role);
      let token = jwt.sign({
        username: request.body.username,
        role: data.role
      }, process.env.SECRET_KEY, { expiresIn: "10h" })

      response.status(200).json({ message: "Login Success", data, token })
      // response.status(200).json({message:"Login Success",data})
    })
    .catch(error => {
      next(error);
    })

}

exports.changePassword = (request, response, next) => {
  // console.log(request.role);
  console.log(request.role)
  if (request.role == "speaker") {
    // Speaker.updateOne({ email: request.body.email, password: request.body.password }, {
    //   $set: {
    //     password: request.body.newpassword,
    //   }
    // }).then(data => {
    //   console.log("data", data);
    //   if (data == null || data.acknowledged == false) throw new Error("email or password is incorect");
    //   response.status(200).json({ message: "password changed", data })
    // })
    //   .catch(error => next(error))

    //Getting Password to compare it
    Speaker.findOne({ email: request.body.email }).then(data => {
      if (data == null) {
        throw new Error("email not found");
      }
      // response.status(200).json(data)
      // console.log(data.password); 
      let matched = bcrypt.compareSync(request.body.password, data.password);
      if (matched) {
        //change Password
        console.log("password matched..")
        let hashed = bcrypt.hashSync(request.body.newpassword, 10);

        Speaker.updateOne({ email: request.body.email }, {
          $set: {
            password: hashed,
          }
        }).then(data => {
          // if (data == null || data.acknowledged == false) throw new Error("email or password is incorect");
          response.status(200).json({ message: "password changed", data })
        })
          .catch(error => next(error))
      }
      else {
        throw new Error("Password is incorrect");
      }
    }).catch(error => {
      next(error);
    });


  }
  else if (request.role == "student") {
    //Getting Password to compare it
    Student.findOne({ email: request.body.email }, { password: 1 }).then(data => {
      if (data == null) {
        throw new Error("email not found");
      }
      // response.status(200).json(data)
      // console.log(data.password);
      let matched = bcrypt.compareSync(request.body.password, data.password);
      if (matched) {
        //change Password
        console.log("password matched..")
        let hashed = bcrypt.hashSync(request.body.newpassword, 10);

        Student.updateOne({ email: request.body.email }, {
          $set: {
            password: hashed,
          }
        }).then(data => {
          // if (data == null || data.acknowledged == false) throw new Error("email or password is incorect");
          response.status(200).json({ message: "password changed", data })
        })
          .catch(error => next(error))
      }
      else {
        throw new Error("Password is incorrect");
      }
    }).catch(error => {
      next(error);
    });

    // console.log(">>>>>>>passs", s);
    // then(data => {
    //   response.status(200).json(data)
    // })
    // .catch(error => {
    //     next(error);
    // })
    // Student.updateOne({ email: request.body.email, password: request.body.password }, {
    // $set: {
    //   password: request.body.newpassword,
    // }
    // }).then(data => {
    //   if (data == null || data.acknowledged == false) throw new Error("email or password is incorect");
    //   response.status(200).json({ message: "password changed", data })
    // })
    //   .catch(error => next(error))
  }
  else {
    throw new Error("Not Authorized.");
  }
}

exports.register = (request, response) => {

  let errors = validationResult(request);
  if (!errors.isEmpty()) {
    let error = new Error();
    error.status = 422;
    error.message = errors.array().reduce((current, object) => current + object.msg + " ", "")
    throw error;
  }


  //redirect << 
  //add token 
  request.get("Authorization")
  let token =
    axios.post('http://127.0.0.1:8080/speakers', request.body, { headers: { Authorization: request.get("Authorization") } })
      .then(function (res) {
        console.log(res);
        // response.status(200).json(res);
        // response.status(200).json({data:"REGISTERED"})
        response.send(res.data);
        // console.log(response);
      })
      .catch(function (error) {
        axios.post('http://127.0.0.1:8080/students', request.body, { headers: { Authorization: request.get("Authorization") } })
          .then(function (res) {
            // console.log(response);
            console.log("student Added");
            response.send(res.data);
          })
          .catch(function (error) {
            response.send("can't add student or Speaker. " + error.message);
            // response.json(error)
            // console.log(error);
          })


        // console.log(error);
      });
  // response.status(200).json({data:"REGISTERED"})
  // response.send("fff");
  // response.status(200).json({data:`${request.body}`})
  // response.
}



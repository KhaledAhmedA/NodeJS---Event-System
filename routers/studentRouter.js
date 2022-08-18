const express = require("express");
const { body, query, param } = require("express-validator")
const router = express.Router();

const controller = require("./../Controllers/studentController");
//>>>>
let isAuth = require("./../middleware/authMW");

router.route("/students")
    .get(isAuth, [], controller.getAllStudents)

    .post(isAuth, [
        //body("id").notEmpty().withMessage("ID shouldn't be Empty.").isNumeric().withMessage("ID should be a number."),
        body("fullname").isString().withMessage("invalid Name."),
        body("password").notEmpty().withMessage("Password shouldn't be Empty."),
        body("confirmpassword").custom((value,{req})=>{
            return value == req.body.password ; 
        }).withMessage("password doesn't match"),
        body("email").isEmail().withMessage("invalid Email.")
    ], controller.addStudent)

    .delete(isAuth, [
        body("id").isNumeric().withMessage("ID Should be a number")
    ], controller.deleteStudent)

    .put(isAuth, [
        body("id").notEmpty().withMessage("ID shouldn't be Empty.").isNumeric().withMessage("ID should be a number."),
        body("fullname").isAlpha().withMessage("invalid Name."),
        body("password").notEmpty().withMessage("Password shouldn't be Empty."),
        body("confirmpassword").custom((value,{req})=>{
            return value == req.body.password ; 
        }).withMessage("password doesn't match"),
        body("email").isEmail().withMessage("invalid Email.")
    ], controller.updateStudent)



router.route("/students/:id")
    .get(isAuth, [], controller.getStudent)

module.exports = router;
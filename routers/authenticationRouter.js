const express = require("express");
const { body, query, param } = require("express-validator")
const router = express.Router();

const controller = require("./../Controllers/authenticationController");
let isAuth = require("./../middleware/authMW");


//to check username and password.
router.post("/login", [
    body("username").notEmpty().withMessage("username should not be empty"),
    body("password").notEmpty().withMessage("username should not be empty")
], controller.login);


//to create speaker or student user account
router.post("/register", isAuth, [
    body("fullname").isString().withMessage("invalid Name."),
    body("password").notEmpty().withMessage("Password shouldn't be Empty."),
    body("confirmpassword").custom((value, { req }) => {
        return value == req.body.password;
    }).withMessage("password doesn't match"),
    body("email").isEmail().withMessage("invalid Email."),
], controller.register);

router.post("/changepassword", isAuth, [
    body("email").isEmail().withMessage("invalid Email."),
    body("password").notEmpty().withMessage("Password shouldn't be Empty."),
    body("newpassword").notEmpty().withMessage("New Password shouldn't be Empty.")
], controller.changePassword);



module.exports = router;
const express = require("express");
const { body, query, param } = require("express-validator")
const router = express.Router();

const controller = require("./../Controllers/speakerController");
const Speaker = require("./../models/speakerSchema");
let isAuth = require("./../middleware/authMW");

router.route("/speakers")
    .get(isAuth, [], controller.getAllSpeaker)

    .post([
        // body("id").notEmpty().withMessage("ID shouldn't be Empty.").isNumeric().withMessage("ID should be a number."),
        body("fullname").isString().withMessage("invalid Name."),
        body("password").notEmpty().withMessage("Password shouldn't be Empty."),
        body("confirmpassword").custom((value, { req }) => {
            return value == req.body.password;
        }).withMessage("password doesn't match"),
        body("email").isEmail().withMessage("invalid Email."),
        // .custom((value) => {
        //     Speaker.findOne({ email: value }) != null ; 
        //     console.log(Speaker.findOne({ email: value }));
        // }).withMessage("email should be unique"),
        // body("address").isObject().withMessage("Address should be an object"),
        // body("address.city").notEmpty().withMessage("address.city should not be empty"),
        // body("address.street").notEmpty().withMessage("address.street should not be empty"),
        // body("address.building").notEmpty().withMessage("address.building should not be empty"),
        body("role").custom((value) => {
            return (value == "administrator" || value == "speaker")
        }).withMessage("Role should either be administrator or speaker"),
        // body("image").isString().withMessage("Image should be a string")
        // ,body("blabla").custom((value,{req})=>{
        //     //validation for unique
        //     Speaker.findOne({name:value})
        // })
    ], controller.addSpeaker)

    .delete(isAuth, [
        // body("id").isNumeric().withMessage("ID Should be a number")
        body("email").notEmpty().withMessage("email should not be empty")
    ], controller.deleteSpeaker)

    .put([
        // body("id").notEmpty().withMessage("ID shouldn't be Empty.").isNumeric().withMessage("ID should be a number."),
        body("fullname").isAlpha().withMessage("invalid Name."),
        body("password").notEmpty().withMessage("Password shouldn't be Empty."),
        body("confirmpassword").custom((value, { req }) => {
            return value == req.body.password;
        }).withMessage("password doesn't match"),
        body("email").isEmail().withMessage("invalid Email."),
        // body("address").isObject().withMessage("Address should be an object"),
        // body("address.city").notEmpty().withMessage("address.city should not be empty"),
        // body("address.street").notEmpty().withMessage("address.street should not be empty"),
        // body("address.building").notEmpty().withMessage("address.building should not be empty"),
        // body("role").custom((value)=>{
        //     return ( value == "administrator" || value == "speaker")
        // }).withMessage("Role should either be administrator or speaker"),

        // ,
        body("role").isIn(["administrator", "speaker"]),
        // body("image").isString().withMessage("Image should be a string")
    ], controller.updateSpeaker)



router.route("/speakers/:email")
    .get(isAuth, [], controller.getSpeaker)

module.exports = router;
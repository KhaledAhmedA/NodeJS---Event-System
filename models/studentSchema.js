const mongoose = require("mongoose");
// const autoIncrement = require('mongoose-auto-increment'); 
const AutoIncrement = require('mongoose-sequence')(mongoose);

//TO DO LATER 
//use mongoose-sequence
// autoIncrement.initialize(mongoose.connection);

const schema = new mongoose.Schema({
     _id: Number,
    fullname: String,
    password: String,
    email: {
        type:String,
    },
})

// schema.plugin(autoIncrement.plugin,"student");

schema.plugin(AutoIncrement,{id:"student_id"});
module.exports = mongoose.model("student", schema);

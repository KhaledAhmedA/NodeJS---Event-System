const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    // _id: mongoose.SchemaTypes.ObjectId,
    fullname: String,
    password: String,
    email: {
        type:String,
        unique:true,
        required:true
    },
    address: {
        city: String,
        street: String,
        building: String
    },
    role: {
        type:String,
        enum: ['administrator', 'speaker']
    },
   
    image: String,
})

module.exports = mongoose.model("speaker", schema);
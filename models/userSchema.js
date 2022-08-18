const mongoose = require("mongoose");

const schema = new mongoose.Schema({

    username: String,
    password: String,
    role: {
        type: String,
        enum: ['administrator', 'speaker', 'student']
    }
})

module.exports = mongoose.model("user", schema);

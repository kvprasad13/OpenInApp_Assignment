
const mongoose = require('mongoose');
const userSchema = mongoose.Schema({

    phone_number: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true


    },
    priority: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true
});
module.exports = mongoose.model("User", userSchema);
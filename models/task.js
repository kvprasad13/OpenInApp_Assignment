
const mongoose = require('mongoose');
const taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    due_date: {
        type: Date,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status: {
        type: String,
        required: true
    },
    priority: {
        type: Number,
        required: true

    },
    deleted_at: {
        type: Date,
        default:null
    }
}, {
    timestamps: true
});
module.exports = mongoose.model("Task", taskSchema);
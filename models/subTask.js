
const mongoose = require('mongoose');

const subTaskSchema = mongoose.Schema({

    task_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Task"
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status: {
        type: Number,
        default: 0
    },
    deleted_at: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});
module.exports = mongoose.model("SubTask", subTaskSchema);
const Task = require('../models/task.js');

const SubTask = require('../models/subTask.js');
const createSubTask = async (req, res) => {

    const taskId = req.body.taskId;


    if (!taskId) {

        throw new Error("All fields are required")
    }

    else {

        try {
            const subTask = await SubTask.create({ user_id: req.user.id, task_id: taskId });
            res.status(201).send(subTask);

        }
        catch (err) {
            console.log(err);
            res.status(500).send("Error at creating sub task ");
        }
    }

}
const getSubTasksByTaskId = async (req, res) => {
    const taskId = req.body.taskId;
    console.log("taskId" + taskId);


    try {
        const subTasks = await SubTask.find(taskId ? { user_id: req.user.id, task_id: taskId } : { user_id: req.user.id });
        res.status(200).send(subTasks);

    }
    catch (err) {
        console.log(err);
        res.status(500).send("Error at getting sub task ");
    }
}

const updateSubTask = async (req, res, next) => {
    const subTaskId = req.params.subTaskId;
    const status = req.body.status;
    console.log(subTaskId + " " + status);
    if (!subTaskId || (!status && status !== 0)) {

        throw new Error("All fields are required")
    }
    const subTask = await SubTask.findById({ _id: subTaskId });
    if (!subTask) {
        throw new Error(" Sub Task not found");
    }
    else if (subTask.user_id.toString() !== req.user.id) {
        res.status(403).send("User don't have permission to update other user article");

    }

    else {

        try {

            const updatedSubTask = await SubTask.findByIdAndUpdate({ _id: subTaskId }, { $set: { status: status } }, { new: true });
            next();
            res.status(200).send(updatedSubTask);

        }
        catch (err) {
            console.log(err);
            res.status(500).send("Error at updating sub task ");
        }
    }
}
const deleteSubTask = async (req, res, next) => {
    const subTaskId = req.params.subTaskId;

    if (!subTaskId) {

        throw new Error("All fields are required")
    }
    const subTask = await SubTask.findById({ _id: subTaskId });
    if (!subTask) {
        throw new Error(" Sub Task not found");
    }
    else if (subTask.user_id.toString() !== req.user.id) {
        res.status(403).send("User don't have permission to update other user article");

    }

    else if (subTask.deleted_at !== null) {
        throw new Error(" Sub Task has already been deleted"); 
    }

    else {

        try {

            const updatedSubTask = await SubTask.findByIdAndUpdate({ _id: subTaskId }, { $set: { deleted_at: new Date() } }, { new: true });
            console.log("delete sub task" + updatedSubTask);
            next();
            res.status(200).send(updatedSubTask);

        }
        catch (err) {
            console.log(err);
            res.status(500).send("Error at deleting sub task ");
        }
    }
}
const updateAllSubTasks = async (req, res) => {
    const taskId = req.params.taskId;
    const status = req.body.status;
    console.log("at updateAllSubtasks " + taskId, status)

    try {
        const subTasks = await SubTask.find({ task_id: taskId });
        subTasks.forEach(async (subTask) => {

            await SubTask.findByIdAndUpdate({ _id: subTask._id }, { $set: { status: status === "TODO" ? 0 : 1 } }, { new: true });


        });
    }
    catch (err) {
        throw new Error(err);
    }
}
const deleteAllSubTasks = async (req, res) => {

    const taskId = req.params.taskId;

    try {
        const subTasks = await SubTask.find({ task_id: taskId });
        subTasks.forEach(async (subTask) => {

            await SubTask.findByIdAndUpdate({ _id: subTask._id }, { $set: { deleted_at: new Date() } }, { new: true });


        });
    }
    catch (err) {
        throw new Error(err);
    }
}
const updateTask = async (req, res) => {

    const subTaskId = req.params.subTaskId;


    const task = await SubTask.findOne({ _id: subTaskId });
    const taskId = task.task_id;
    if (!taskId) {
        throw new Error("Task Id not found");
    }
    try {

        const taskStatus = { incomplete: 0, completed: 0, total: 0 };

        const subTasks = await SubTask.find({ task_id: taskId });

        subTasks.forEach((subTask) => {
            if (subTask.deleted_at == null) {
                taskStatus.total++;
                subTask.status === 0 ? taskStatus.incomplete++ : taskStatus.completed++;
            }
        });
        let status;

        if (taskStatus.completed === taskStatus.total) {
            // DONE
            status = "DONE";

        }
        else if (taskStatus.incomplete === taskStatus.total) {
            // TODO
            status = "TODO";

        }
        else {
            // In Progressing
            status = "IN_PROGRESS"

        }
        await Task.findOneAndUpdate({ _id: taskId }, { $set: { status: status } }, { new: true });




    }
    catch (err) {
        throw new Error("Error at updating Task");

    }



}
module.exports = { createSubTask, getSubTasksByTaskId, updateAllSubTasks, updateSubTask, updateTask, deleteSubTask, deleteAllSubTasks };
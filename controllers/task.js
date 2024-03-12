const Task = require('../models/task.js')
const subTask = require('../models/subTask.js')
const { deleteSubTask } = require('./subTask.js');
function isValidDateFormat(dueDate) {
    const dateObject = new Date(dueDate);
    console.log(dateObject.getTime());
    return !isNaN(dateObject.getTime());
}
const getAllPaginatedUsers = (users, page, limit) => {

    const count = users.length;
    let startInd = (page - 1) * limit;
    let endInd = (page) * limit;
    if (endInd <= 0 || startInd >= count) { return [] }
    return users.slice(Math.max(startInd, 0), Math.min(endInd, count));


}
const getPriority = (dueDate) => {

    const currentDate = new Date();

    const oneDay = 24 * 60 * 60 * 1000;


    const differenceInDays = Math.round((dueDate - currentDate) / oneDay);



    if (differenceInDays <= 0) {
        return 0;
    } else if (differenceInDays <= 2) {
        return 1;
    } else if (differenceInDays <= 4) {
        return 2;
    } else {
        return 3;

    }



}
const createTask = async (req, res) => {

    const { title, description, due_date, status } = req.body;
    console.log(title, description, due_date, status);
    if (!title || !description || !status || !due_date) {
        throw new Error("All fields are required");
    }
    else if (!isValidDateFormat(due_date)) {
        throw new Error("Date must be a valid date");
    }
    else {
        try {
            const newTask = await Task.create({ title, description, status, due_date: new Date(due_date), priority: getPriority(new Date(due_date)), user_id: req.user.id });
            res.status(201).send(newTask);
        }
        catch (err) {
            console.log(err);
            throw new Error("Error creating task");
        }


    }

}

const getTasks = async (req, res) => {








    try {
        const tasks = await Task.find({ user_id: req.user.id });

        res.status(200).send(tasks);
    }
    catch (err) {
        res.status(400).send("error getting tasks");
    }






}
const getTasksByPriority = async (req, res) => {
    const { priority } = req.params;
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);


    if (!priority) {
        res.status(400).send("Priority is required ");
        return;
    }



    else {

        try {
            const tasks = await Task.find({ user_id: req.user.id });

            const filteredTasks = tasks.filter((task) => Number(priority) === getPriority(task.due_date));

            const paginatedUsers = getAllPaginatedUsers(filteredTasks, page, limit);

            res.status(200).send(paginatedUsers);
        }
        catch (err) {
            res.status(400).send("error getting tasks");
        }



    }


}
const getTasksByDueDate = async (req, res) => {
    console.log(req.query.due_date);
    const due_date = req.query.due_date;
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);


    console.log(due_date + " " + page + " " + limit);


    if (!due_date) {
        res.status(400).send("dueDate is required ");
        return;
    }

    else if (!isValidDateFormat(due_date)) {
        throw new Error("Date must be a valid date");
    }


    else {

        try {
            const tasks = await Task.find({ user_id: req.user.id });
            console.log(tasks);
            const filteredTasks = tasks.filter((task) => new Date(due_date).getTime() === task.due_date.getTime());

            const paginatedUsers = await getAllPaginatedUsers(filteredTasks, page, limit);

            res.status(200).send(paginatedUsers);
        }
        catch (err) {
            res.status(400).send("error getting tasks");
        }



    }

}

const updateTask = async (req, res, next) => {

    const taskId = req.params.taskId;


    const { due_date, status } = req.body;
    console.log(req.body);

    if (!taskId) {
        res.status(400).send("Task ID is required");
        return;
    }
    const task = await Task.findById({ _id: taskId });
    if (!task) {
        res.status(404).send("Task is not found");
        return;
    }

    if (!due_date && !status) {
        res.status(400).send("At least one Field is required");
    }
    else if (task.user_id.toString() !== req.user.id) {
        res.status(403).send("User don't have permission to update other user article");

    }
    else {
        if (due_date && !isValidDateFormat(due_date)) {
            res.status(400).send("Date must be a valid");
            return;
        }

        try {
            if (status && (status === "DONE" || status === "TODO")) {
                console.log("updating subtasks")
                next();
            }
            const newAddTask = task;
            if (status) newAddTask.status = status;
            if (due_date) newAddTask.due_date = due_date;
            const newTask = await Task.findByIdAndUpdate({ _id: taskId }, newAddTask, { new: true });


            res.status(200).send(newTask);
        }
        catch (err) {
            res.status(400).send("error updating task");
        }



    }
}
const deleteTask = async (req, res, next) => {

    const taskId = req.params.taskId;
    if (!taskId) {
        res.status(400).send("Task ID is required");
        return;
    }
    const task = await Task.findOne({ _id: taskId });
    if (!task) {
        console.log("Task not found")
        throw new Error(err.message);
    }
    else if (task.user_id.toString() !== req.user.id) {
        res.status(403).send("User don't have permission to update other user article");

    }
    else if (task.deleted_at !== null) {
        throw new Error("Task has been already deleted")
    }
    else {
        try {
            next();


            const updatedTask = await Task.findByIdAndUpdate({ _id: taskId }, { $set: { deleted_at: new Date() } }, { new: true });
            res.status(200).send(updatedTask);
        }
        catch (err) {
            console.log("Error at DeleteTask")
            res.status(500).send(err.message);
        }

    }
}
module.exports = { createTask, updateTask, deleteTask, getTasks, getTasksByPriority, getTasksByDueDate, getPriority }
const express = require('express');
const process = require('dotenv').config();
const cors = require('cors');
const { connectDb } = require('./config/dbConnection');
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/task.js')
const subTaskRouter = require('./routers/subTask.js')
const cron = require("node-cron");
const { getPriority } = require("./controllers/task.js");
const Task = require('./models/task.js');

const { makeCallsToUser } = require('./twilio/user.js');
const app = express();
app.use(express.json());
app.use(cors())
connectDb();

app.use('/api/users', userRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/subTasks', subTaskRouter);

// for Priority Updates
cron.schedule('0 0 * * *', async () => { // Runs every day at midnight
    try {

        const tasks = await Task.find({});
        tasks.forEach(async (task) => {
            await Task.findByIdAndUpdate({ _id: task._id }, { $set: { priority: getPriority(task.due_date) } });
        });


    } catch (error) {
        console.error('Error updating task priority:', error);
    }
});

// Cron job to make voice calls for tasks past their due date
cron.schedule('0 0 * * *', makeCallsToUser);

const port = 8000;
app.listen(port, () => {
    console.log(`server listening on http://localhost:${port}`);
});
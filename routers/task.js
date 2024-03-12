
const express = require('express');
const validateToken = require('../middlewares/validateToken.js');
const { createTask, updateTask, deleteTask, getTasks, getTasksByPriority, getTasksByDueDate } = require('../controllers/task.js');
const {updateAllSubTasks,deleteAllSubTasks} = require('../controllers/subTask.js');
const router = express.Router();

router.use(validateToken);
router.route('/').post(createTask).get(getTasks);
router.get('/priority/:priority', getTasksByPriority).get('/due_date/', getTasksByDueDate);
router.put('/:taskId', updateTask,updateAllSubTasks);
router.delete('/:taskId', deleteTask,deleteAllSubTasks);


module.exports = router;
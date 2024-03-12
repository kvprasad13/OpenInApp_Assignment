const express = require('express');
const router = express.Router();

const validateToken = require("../middlewares/validateToken");
const { createSubTask, getSubTasksByTaskId, updateSubTask, deleteSubTask, updateTask } = require('../controllers/subTask.js');
router.use(validateToken);


router.route('/').post(createSubTask).get(getSubTasksByTaskId);

router.route('/:subTaskId').put(updateSubTask, updateTask).delete(deleteSubTask, updateTask);

module.exports = router;
const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/taskController');

router.post('/', tasksController.createTask);


router.get('/', tasksController.getTasks);


router.get('/:taskId', tasksController.getTaskById);

router.put('/:taskId', tasksController.updateTask);


router.delete('/:taskId', tasksController.deleteTask);


router.patch('/:taskId/status', tasksController.changeTaskStatus);

module.exports = router;
const Task = require('../models/Task');
const User = require('../models/User');

exports.createTask = async (req, res) => {
    try {
        const { description, status, assigned_to, created_by } = req.body;
        const newTask = new Task({  description, status, assigned_to, created_by });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate('assigned_to created_by');
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId).populate('assigned_to created_by');
        if (!task) {
            return res.status(404).json({ error: "Task-ul nu a fost găsit" });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const update = req.body;
        const task = await Task.findByIdAndUpdate(req.params.taskId, update, { new: true });
        if (!task) {
            return res.status(404).json({ error: "Task-ul nu a fost găsit" });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.taskId);
        if (!task) {
            return res.status(404).json({ error: "Task-ul nu a fost găsit" });
        }
        res.status(200).json({ message: "Task șters cu succes" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.changeTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findById(req.params.taskId);
        if (!task) {
            return res.status(404).json({ error: "Task-ul nu a fost găsit" });
        }
        task.status = status;
        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
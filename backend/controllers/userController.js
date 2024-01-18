const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const SECRET_KEY = "your_secret_key_here"; 

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, manager_name } = req.body;
        const newUser = new User({ name, email, password, role, manager_name });
        if (role === 'executant') {
            newUser.manager_name = manager_name;
        }
        await newUser.save();
        res.status(200).json({ message:"Utilizator înregistrat cu succes" });
    } catch (error) {
        res.status(500).json({ error: "Utilizator deja existent" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: "Email sau parolă incorectă" });
        }
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: "Autentificare reușită", token });
    } catch (error) {
        res.status(500).json({ error: "Autentificare nereusita" });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: "Utilizatorul nu a fost găsit" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const update = req.body;
        const user = await User.findByIdAndUpdate(req.params.userId, update, { new: true });
        if (!user) {
            return res.status(404).json({ error: "Utilizatorul nu a fost găsit" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: "Utilizatorul nu a fost găsit" });
        }
        res.status(200).json({ message: "Utilizator șters cu succes" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
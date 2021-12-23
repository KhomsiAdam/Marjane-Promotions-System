// dotenv
require('dotenv').config();
// Validator
const { validationResult } = require('express-validator');
// Bcrypt
const bcrypt = require('bcryptjs');
// JWT
const jwt = require('jsonwebtoken');

// Models
const SuperAdmin = require('../models/SuperAdmin');

// Register
exports.register = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    // Hash password then create the user
    bcrypt
        .hash(password, 12)
        .then(hashedPw => {
            const user = new SuperAdmin({
                email: email,
                password: hashedPw
            });
            return user.save();
        })
        .then(result => {
            res.status(201).json({ message: 'SuperAdmin created!' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

// Login
exports.login = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    SuperAdmin.findOne({ where: { email: email } })
        .then(user => {
            if (!user) {
                const error = new Error('A user with this email could not be found.');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            // Check password
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password!');
                error.statusCode = 401;
                throw error;
            }
            // Generate token
            const token = jwt.sign(
                process.env.SUPER_KEY,
                { expiresIn: '1h' }
            );
            res.status(200).json({ token: token });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

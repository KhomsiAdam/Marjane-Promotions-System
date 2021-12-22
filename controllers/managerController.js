// dotenv
require('dotenv').config();
// Validator
const { validationResult } = require('express-validator');
// Bcrypt
const bcrypt = require('bcryptjs');
// JWT
const jwt = require('jsonwebtoken');
// Password generator
const generator = require('generate-password');
// Mailer
const mail = require('../helpers/mail');

// Models
const Manager = require('../models/Manager');

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
    const category = req.body.category;
    const centerId = req.body.centerId;
    const password = generator.generate({
        length: 10,
        numbers: true
    });
    console.log(password);
    mail(email, password).catch(console.error);
    bcrypt
        .hash(password, 12)
        .then(hashedPw => {
            const user = new Manager({
                email: email,
                password: hashedPw,
                category: category,
                centerId: centerId
            });
            return user.save();
        })
        .then(result => {
            res.status(201).json({ message: 'User created!', userId: result._id });
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
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    Manager.findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error('A user with this email could not be found.');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password!');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign(
                {
                    email: loadedUser.email,
                    userId: loadedUser._id
                },
                process.env.MANAGER_KEY,
                { expiresIn: '1h' }
            );
            res.status(200).json({ token: token, userId: loadedUser._id });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

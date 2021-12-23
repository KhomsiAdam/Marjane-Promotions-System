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
const Admin = require('../models/Admin');
const { load } = require('dotenv');

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
    const centerId = req.body.centerId;
    // Generate a random password
    const password = generator.generate({
        length: 10,
        numbers: true
    });
    console.log(password);
    // Send email with credentials
    mail(email, password).catch(console.error);
    // Hash password then create the user
    bcrypt
        .hash(password, 12)
        .then(hashedPw => {
            const user = new Admin({
                email: email,
                password: hashedPw,
                centerId: centerId
            });
            return user.save();
        })
        .then(result => {
            res.status(201).json({ message: 'Admin created!'});
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
    Admin.findOne({ where: { email: email } })
        .then(user => {
            if (!user) {
                const error = new Error('An Admin with this email could not be found.');
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
                {
                    centerId: loadedUser.centerId
                },
                process.env.ADMIN_KEY,
                { expiresIn: '1h' }
            );
            res.status(200).json({ token: token, centerId: loadedUser.centerId });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

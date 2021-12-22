// Express
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Models
const Manager = require('../models/Manager');

// Controllers
const adminController = require('../controllers/adminController');
const managerController = require('../controllers/managerController');

// Auth
const isAdmin = require('../middleware/isAdmin');

// Admin login
router.post('/login', adminController.login);

// Manager creation
router.post('/manager',
    isAdmin,
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
                return Manager.findOne({
                    where: {
                        email: value
                    }
                }).then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('E-Mail address already exists!');
                    }
                });
            })
            .normalizeEmail(),
        body('category')
            .trim(),
        body('centerId')
            .trim()
    ],
    managerController.register
);

module.exports = router;

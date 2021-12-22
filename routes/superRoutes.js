// Express
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Models
const SuperAdmin = require('../models/SuperAdmin');
const Admin = require('../models/Admin');

// Controllers
const superController = require('../controllers/superController');
const adminController = require('../controllers/adminController');

// Auth
const isSuper = require('../middleware/isSuper');

// SuperAdmin register
router.post(
    '/register',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
                return SuperAdmin.findOne({
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
        body('password')
            .trim()
            .isLength({ min: 5 })
    ],
    superController.register
);

// SuperAdmin login
router.post('/login', superController.login);

// Admin creation
router.post('/admin',
    isSuper,
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
                return Admin.findOne({
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
        body('password')
            .trim()
            .isLength({ min: 5 }),
        body('centerId')
            .trim()
    ],
    adminController.register
);

module.exports = router;

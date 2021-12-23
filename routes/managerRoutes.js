// Express
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Controllers
const managerController = require('../controllers/managerController');
const promotionController = require('../controllers/promotionController');

// Auth
const isManager = require('../middleware/isManager');

// Manager login
router.post('/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .normalizeEmail(),
        body('password')
            .trim()
    ],
    managerController.login);

// Get Promotions assigned to connected manager
router.get('/promotions', isManager, promotionController.getMyPromotions);

// Promotion update
router.patch('/promotion',
    isManager,
    [
        body('promotionId')
            .trim(),
        body('status')
            .trim(),
        body('comment')
            .trim(),
        body('currentStock')
            .trim()
    ],
    promotionController.updatePromotion);

module.exports = router;

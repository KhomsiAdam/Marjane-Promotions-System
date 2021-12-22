// Validator
const { validationResult } = require('express-validator');

// Models
const Promotion = require('../models/Promotion');
const Product = require('../models/Product');

exports.create = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    const discount = req.body.discount;
    const day = req.body.day;
    const productId = req.body.productId;
    
    const fidelity = (discount / 5) * 50;
    console.log(discount + '%');
    console.log(fidelity + 'dh');

    Product.findOne({ where: { id: productId }, raw: true })
        .then(product => {
            if (!product) {
                const error = new Error('A product with this id could not be found.');
                error.statusCode = 401;
                throw error;
            }
            console.log(product);
            if ((product.category === 'Multimedia' && discount <= 20) || product.category !== 'Multimedia' && discount <= 50) {
                console.log('OK');
                const promotion = new Promotion({
                    discount: discount,
                    fidelity: fidelity,
                    status: 'Pending',
                    day: day,
                    productId: productId
                });
                promotion
                    .save()
                    .then(result => {
                        res.status(201).json({
                            message: 'Promotion created successfully!',
                            promotion: result
                        });
                    })
                    .catch(err => {
                        if (!err.statusCode) {
                            err.statusCode = 500;
                        }
                        next(err);
                    });
            } else if ((product.category === 'Multimedia' && discount > 20) || product.category !== 'Multimedia' && discount > 50) {
                console.log('NO');
                let message;
                if (product.category === 'Multimedia') {
                    message = 'Product discount of Multimedia category must not exceed 20%.';
                } else {
                    message = 'Product discount must not exceed 50%.';
                }
                res.status(400).json({
                    message: message
                });
            }
        })
};
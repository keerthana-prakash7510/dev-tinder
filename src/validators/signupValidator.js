const { body, validationResult } = require('express-validator');

const signUpValidator = [
    // firstName validation and sanitization
    body('firstName')
        .trim() // Sanitize: Remove leading/trailing whitespace
        .notEmpty().withMessage('First name is required.')
        .isLength({ min: 2 }).withMessage('First name must be at least 2 characters.'),
    
    // lastName validation and sanitization
    body('lastName')
        .trim() // Sanitize: Remove leading/trailing whitespace
        .notEmpty().withMessage('Last name is required.'),

    
    // emailId validation and sanitization
    body('emailId')
        .trim() // Sanitize
        .toLowerCase() // Sanitize: Convert to lowercase for consistency
        .isEmail().withMessage('Must be a valid email address.'),


    // password validation
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),

    // age validation
    body('age')
        .optional({ checkFalsy: true })
        .isInt({ min: 18, max: 65 }).withMessage('Age must be a number between 18 and 65.'),
    
    // gender validation
    body('gender')
        .optional({ checkFalsy: true })
        .isIn(['male', 'female']).withMessage('Gender must be male or female .')
];

module.exports = { signUpValidator };
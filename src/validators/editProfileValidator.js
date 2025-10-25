const { body, validationResult } = require('express-validator');

const allowedEdits = ["firstName","lastName","gender","age","photoUrl","about","skills","familyType"];

const validateEditProfileData = [

    body().custom((value,{req})=>{
        const incomingKeys = Object.keys(req.body);
        const isEditAllowed = incomingKeys.every(key => allowedEdits.includes(key));
        if(!isEditAllowed){
            const invalidKeys = incomingKeys.filter(key => !allowedEdits.includes(key));
            throw new Error(`Invalid update field(s) provided: ${invalidKeys.join(', ')}`);
        
        }
        return true;
    }),
    
    body('firstName')
        .trim() // Sanitize: Remove leading/trailing whitespace
        .optional({ checkFalsy: true })
        .isLength({ min: 2 }).withMessage('First name must be at least 2 characters.'),
    
   
    body('lastName')
        .trim(), // Sanitize: Remove leading/trailing whitespace
        
    
    body('photoUrl')
        .isURL()
        .optional({ checkFalsy: true }),

    
    body('age')
        .optional({ checkFalsy: true })
        .isInt({ min: 18, max: 65 }).withMessage('Age must be a number between 18 and 65.'),
    
    
    body('gender')
        .optional({ checkFalsy: true })
        .isIn(['male', 'female']).withMessage('Gender must be male or female .'),
    
    body('about')
        .optional({ checkFalsy: true }),
    
    body('skills')
        .optional({ checkFalsy: true })
];

module.exports = { validateEditProfileData };
const { param, validationResult } = require('express-validator');

const sendConnectionRequestValidator = [
    // status → must be "interested" or "ignored" only
    param('status')
        .trim()
        .toLowerCase()
        .isIn(['interested', 'ignored'])
        .withMessage('Status must be either "interested" or "ignored".'),

    // toUserId → must be a valid MongoDB ObjectId
    param('toUserId')
        .isMongoId()
        .withMessage('Invalid user ID format.'),

    // Final error collector (same pattern you use everywhere)
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Return only the first error message (clean & user-friendly)
            return res.status(400).json({
                message: errors.array()[0].msg
            });
        }
        next();
    }
];

module.exports = { sendConnectionRequestValidator };
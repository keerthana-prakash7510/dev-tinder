var jwt = require('jsonwebtoken');
const { User } = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token){
            throw new Error("Invalid request!");  
        }
        var decoded = jwt.verify(token, 'shhhhh');
        const user = await User.findById({_id:decoded.userId});
        if(!user){
            throw new Error("User does not exists!");
        }
        req.user = user;
        next();
        
    } catch (err) {
        console.error("Authentication failed", err);
        res.status(500).send({
            message: "An internal server error occurred while processing the request.",
            errorDetails: err.message
        });
        
    }

} 
module.exports = {
    userAuth
}




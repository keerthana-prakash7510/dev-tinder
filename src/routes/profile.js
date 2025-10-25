const express = require('express');
const profileRouter = express();
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require('../validators/editProfileValidator');
const { validationResult } = require('express-validator');


profileRouter.get("/view",userAuth,async(req,res)=>{
    console.log("req.body",req.body)
    const user = req.user;
    if(!user){
        throw new Error("User does not exists!");
    }
    res.send(user);
}),

profileRouter.patch("/editProfile",userAuth,validateEditProfileData,async(req,res)=>{
    const errors = validationResult(req);    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let loggedInUser = req.user;
        Object.keys(req.body).forEach((key)=>loggedInUser[key]= req.body[key]);
        await loggedInUser.save();
        res.json({
            message:"Profile updated Successfully!",
            data:loggedInUser

        })
        
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'An internal server error occurred.' });
        
    }


})
module.exports = profileRouter;
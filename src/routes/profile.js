const express = require('express');
const profileRouter = express();
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require('../validators/editProfileValidator');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const {User} = require('../models/user')

const transporter = nodemailer.createTransport({
    service: 'Gmail', // or another service
    auth: {
        user: 'keerthanaprakash4work@gmail.com',
        pass: 'yvha wlor ncwe lavb'
    }
});


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


}),
profileRouter.post('/forgotPassword', async (req, res) => {
    
    const { emailId } = req.body;
    const user = await User.findOne({ emailId });
    console.log("User",user)
    if (!user) {
        return res.status(200).json({ 
            message: 'If an account exists for that email, a password reset link will be sent.' 
        });
    }
    try {
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();
        const resetUrl = `http://${req.headers.host}/reset-password/${resetToken}`;
        const mailOptions = {
            to: user.emailId,
            from: 'keerthanaprakash4work@gmail.com',
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset. Click this link to set a new password:</p><a href="${resetUrl}">${resetUrl}</a><p>This link will expire in 1 hour.</p>`
        };
        console.log(mailOptions);
        await transporter.sendMail(mailOptions);
        res.status(200).json({ 
            message: 'Password reset link sent successfully.' 
        });

    }catch(err){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        console.error('Password reset email error:', err);
        res.status(500).json({ 
            message: 'Error sending reset email.' 
        });

    }

})
module.exports = profileRouter;
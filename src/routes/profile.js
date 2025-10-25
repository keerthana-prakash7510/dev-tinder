const express = require('express');
const profileRouter = express();
const { userAuth } = require('../middlewares/auth');

profileRouter.get("/profile",userAuth,async(req,res)=>{
    console.log("req.body",req.body)
    const user = req.user;
    if(!user){
        throw new Error("User does not exists!");
    }
    res.send(user);
})
module.exports = profileRouter;
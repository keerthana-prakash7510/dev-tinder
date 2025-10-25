const express = require('express');
const requestRouter = express();
const { userAuth } = require('../middlewares/auth');


requestRouter.post("/sendConnectionRequest",userAuth,async(req,res)=>{
    try{
        const user = req.user;
        res.status(200).send("Connection request send")
    }catch(err){
        console.error("User search failed:", err);
        res.status(500).send({
            message: "An internal server error occurred while processing the request.",
            errorDetails: err.message
        });
    }
})
module.exports = requestRouter;
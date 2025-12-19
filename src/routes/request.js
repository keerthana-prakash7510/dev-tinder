const express = require('express');
const requestRouter = express();
const { userAuth } = require('../middlewares/auth');
const {ConnectionRequest } = require('../models/connectionRequest');
const {sendConnectionRequestValidator} = require('../validators/connectionRequestValidator');
const { User } = require('../models/user');


/*
Use:"Used to send the connection request"
Criteria: 
    1.  If a user A sends connection request to user B, we need to check if A already send the connection
    before or not?
    2. check if there is connection request from B to A exists in these two cases we cant send the connection
    requests we need to block it and say connection request already exists
    3. check if the toUserId is exists in the user db or not.
    4. a user A cant send connection request to himself. A ->A not allowed

*/
requestRouter.post("/send/:status/:toUserId",userAuth,sendConnectionRequestValidator,async(req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:"Invalid status type: "+status
            })
        }
        let user = await User.findById(toUserId);
        if(!user){
            return res.status(400).json({
                message:"User not found"
            })
        }
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId}, // checking if connection exists A -> B
                {fromUserId:toUserId, toUserId:fromUserId} // checking if connection exists from B -> A
            ]
        })
        if(existingConnectionRequest){
            return res.status(400).json({
                message:"Connection Request Already Exists"
            })

        }

        const connectionRequestData = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        const data = await connectionRequestData.save();

        return res.json({
            message:"Connection request send Successfully",
            data
        })

    }catch(err){
        console.error("User search failed:", err);
        return res.status(500).send({
            message: "An internal server error occurred while processing the request.",
            errorDetails: err.message
        });
    }
});

/* This api we can use for accepting and rejecting request , we need to send 
only "accepted" or "rejected" in the url as status
*/
requestRouter.post("/review/:status/:requestId",userAuth, async (req,res)=>{

    try{
        let {status,requestId} = req.params;
        loggedInUser = req.user;

        let allowedStatus = ["accepted","rejected"];
        //1. checking if the status is a valid one.
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:"Not Allowed Status " +status,

            });
        }
        /* 1. if the connection requestId is valid, ie, is there anyconnection request exists 
        in the connection request db.
        2. check if the toUserid is logged in or not
        3. check if the connection status is interested or not.
        */
       const connectionRequest = await ConnectionRequest.findOne({
        _id:requestId,
        toUserId:loggedInUser,
        status:"interested"
       })
       if(!connectionRequest){
        return res.status(400).json({message:"No connection request found"});
       }

       connectionRequest.status = status;
       const data = await connectionRequest.save();
       return res.json({
        message:"Connection request "+status,
        data:data
    })


    }catch(err){
        res.status(400).send("Error: ",err.message);
    }

})
module.exports = requestRouter;
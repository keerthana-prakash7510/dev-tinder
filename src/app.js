const express = require('express');
const app = express();
const {connectDB} = require("./config/database");
const User = require("./models/user").User;
const v8 = require('v8');

app.use(express.json());

app.post("/user",async(req,res)=>{
    try{
        const user = await User.findOne({emailId:req.body.emailId}).lean();

        const normalDoc = await User.findOne({emailId:req.body.emailId});
        const leanDoc = await User.findOne({emailId:req.body.emailId}).lean();

        console.log(v8.serialize(normalDoc).length); // approximately 180
        console.log(v8.serialize(leanDoc).length);

        if(user){
            res.status(200).send(user);
        }else{
            res.status(404).send("User not found!")
        }

    }catch(err){
        console.error("User search failed:", err);
        res.status(500).send({
            message: "An internal server error occurred while processing the request.",
            errorDetails: err.message
        });
    }

})
app.delete("/user",async(req,res)=>{
    try{
        const deletedUser = await User.findByIdAndDelete(req.body.userId);
        res.status(200).send("User removed!")

    }catch(err){
        console.log("Error",err);
        res.status(500).send({
            message: "Internal server error!",
            errorDetails: err.message
        });

    }
    

})

app.patch("/user",async(req,res)=>{
    const userId = req.body.userId
    const data = req.body
    try{
        const updatedUser = await User.findByIdAndUpdate({_id:userId},data,{new:false});
        console.log(updatedUser);
        res.status(200).send("User Updated!")

    }catch(err){
        console.log("Error",err);
        res.status(500).send({
            message: "Internal server error!",
            errorDetails: err.message
        });

    }
    

})
app.get("/feed",async(req,res)=>{
    try{
        const users = await User.find({}).lean();
        if(users){
            res.status(200).send(users);
        }else{
            res.status(404).send("User not found!")
        }

    }catch(err){
        res.status(404).send(err)
    }

})


app.post("/signUp",async(req,res)=>{
    console.log("hello",req.body)
    const newUser = await new User({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        emailId: req.body.emailId,
        password:req.body.password,
        age:req.body.age,
        gender:req.body.gender
    })
    const saveNewUser = await newUser.save();
    res.send(saveNewUser);


})

connectDB()
    .then(()=>{
        console.log("Database connected successfully");
        app.listen(3000,()=>{
            console.log("Server is listening to port 3000");
        })
        
    })
    .catch((err)=>{
        console.error("Database Cannot connected!",err);
    })
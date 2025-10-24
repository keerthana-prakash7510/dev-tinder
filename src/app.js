const express = require('express');
const app = express();
const {connectDB} = require("./config/database");
const User = require("./models/user").User;
const v8 = require('v8');
const { validationResult } = require('express-validator');
const { signUpValidator } = require('./validators/signupValidator');

var cookieParser = require('cookie-parser')
const saltRounds = 10;
const { userAuth } = require('./middlewares/auth');


app.use(express.json());
app.use(cookieParser());


app.post("/signUp",signUpValidator,async(req,res)=>{
    const errors = validationResult(req);    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try{
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const newUser = await new User({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            emailId: req.body.emailId,
            password:hashedPassword,
            age:req.body.age,
            gender:req.body.gender,
        })
    const saveNewUser = await newUser.save();
    res.status(201).send(saveNewUser);

    }catch(err){
        console.error(err);
        res.status(500).send({ message: 'An internal server error occurred.' });
    }
        
})
app.post("/login",async(req,res)=>{
    try {
        const {emailId,password} = req.body;
        console.log('Cookies: ', req.cookies)
        const user = await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Invalid Credentials");
            
        }
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            const token = await user.getJWT();
            res.cookie('jwt', token);
            res.status(200).send("Logged in successfully");
            
        }else{
            throw new Error("Invalid Credentials!");   
        }
        
    } catch (err) {

        console.error("User search failed:", err);
        res.status(500).send({
            message: "An internal server error occurred while processing the request.",
            errorDetails: err.message
        });
        
    }

})
app.get("/profile",userAuth,async(req,res)=>{
    console.log("req.body",req.body)
    const user = req.user;
    if(!user){
        throw new Error("User does not exists!");
    }
    res.send(user);
})

app.post("/sendConnectionRequest",userAuth,async(req,res)=>{
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
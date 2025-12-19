const express = require('express');
const app = express();
var cookieParser = require('cookie-parser')
const {connectDB} = require("./config/database");
const routes = require("./routes/routes");


app.use(express.json());
app.use(cookieParser());
app.use("/v1/",routes);

app.get("/test", (req,res) => {
    res.send("Hello world!!")
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
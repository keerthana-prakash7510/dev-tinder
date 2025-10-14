const express = require('express');
const app = express();

app.use("/hello",(req,res)=>{
    res.send("Hello from dashboard 1")
});
app.use("/test",(req,res)=>{
    res.send("This is test")
})

app.listen(3000)
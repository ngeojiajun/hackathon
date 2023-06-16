const express = require("express");

const app = express();
app.get("/",function(req,res,next){
    res.end("Hello");
})
app.listen(12345);
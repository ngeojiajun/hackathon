// Submission endpoint
const express = require("express");
const multer = require("multer");
const app = express.Router();
const uploader = multer({dest:'./uploads'});

app.post("/ocr", uploader.single('receipt'),async function (req, res, next){
    try {
    }
    catch(e) {
        console.error(e);
        next(e);
    }
});

app.post("/claims", async function (req,res,next){
    try {

    }
    catch(e) {
        console.error(e);
        next(e);
    }
});

module.exports = app;
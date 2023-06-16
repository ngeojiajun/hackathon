// Submission endpoint
const express = require("express");
const multer = require("multer");
const app = express.Router();
const uploader = multer({dest:'./uploads'});

app.post("/ocr", uploader.single('receipt'),async function (req, res, next){
    try {
        // save the file
        // req.file
        // pass the file for ocr
        // return the json about the decoded stuffs
        res.json({
            order_id: 12345,
            price: 123,
            receipt: './xxx/xxxx',
            vendor_name:'xxx'
        });
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
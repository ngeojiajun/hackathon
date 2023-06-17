// Submission endpoint
const express = require("express");
const multer = require("multer");
const app = express.Router();
const uploader = multer({dest:'./uploads'});
const tesseract = require("node-tesseract-ocr")

const tesseract_config = {
  lang: "eng",
  tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$:. '
}
app.post("/ocr", uploader.single('receipt'),async function (req, res, next){
    try {
        if(!req.file) {
            res.end('No file provided');
            return;
        }
        // req.file.path
        let result = await tesseract.recognize(req.file.path,tesseract_config);
        res.end(result);
    }
    catch(e) {
        console.error(e);
        res.end("Cannot process the file");
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
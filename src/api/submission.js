// Submission endpoint
const express = require("express");
const multer = require("multer");
const app = express.Router();
const uploader = multer({
    storage : multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, './uploads')
        },
        filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, file.fieldname + '-' + uniqueSuffix+file.originalname.match(/(\.[^.]*)$/)?.[0])
        }
      })
});
const tesseract = require("node-tesseract-ocr");
const db_conn = require("../db/PostgresConnection");

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
        else if(!req.body.employee_id){
            res.end('No employee id provided');
            return;
        }
        let result = await tesseract.recognize(req.file.path,tesseract_config);
        const invoiceNumberPattern = /Invoice\s?No\s*:\s*(\w+)/;
        const vendorNamePattern = /^\s*([^\n]+)/;
        const totalAmountPattern = /Total\s?Payment\s?Received\s+([\d.]+)/;

        const invoiceNumberMatch = result.match(invoiceNumberPattern)?.[1];
        const vendorNameMatch = result.match(vendorNamePattern, "m")?.[1];
        const totalAmountMatch = result.match(totalAmountPattern)?.[1];
        res.render('claim_submission.ejs',{
            employee_id: req.body.employee_id,
            receipt: req.file.filename,
            vendor_name: vendorNameMatch,
            invoice_number:invoiceNumberMatch,
            total_amount: totalAmountMatch,
            remarks:''
        });
    }
    catch(e) {
        console.error(e);
        res.end("Cannot process the file");
    }
});

app.post("/claims", async function (req,res,next){
    try {
        let {
            employee_id,
            receipt,
            vendor_name,
            invoice_number,
            total_amount,
            purchase_type,
            remarks
        } = req.body;
        if(!employee_id||!receipt||!vendor_name||!invoice_number||!total_amount||!purchase_type){
            res.status(400).end('Incomplete input');
            return;
        }
        let result = await db_conn.exec_query(async function (client){
            let result = await client.query(`
                SELECT * FROM claims.vendor WHERE lower(vendor_name) = lower($1)
            `,[vendor_name]);
            let vendor_id = result.rows[0]?.vendor_id || 1;
            let status = 'pending';
            if(vendor_id > 1){
                result = await client.query(`SELECT * FROM claims.claims WHERE vendor_id = $1 AND vendor_name IS NULL AND receipt_number = $2`,
                [vendor_id, invoice_number]);
                if(!result.rowCount) {
                    status = 'approved';
                }
            }
            result = await client.query(`
            INSERT INTO claims.claims (vendor_id, vendor_name, receipt_number, purchase_type, price, receipt_picture, employee_id, remarks, claim_status)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9);
            `,[vendor_id, vendor_id==1?vendor_name:null, invoice_number, purchase_type, total_amount, receipt, employee_id, remarks, status]);
            return status === 'approved' ? 2 :1;
        });
        if(result) {
            res.status(200).end('Updated'+(result===2?' and approved':''));
        }
        else {
            res.status(500).end('Cannot add claim');
        }
    }
    catch(e) {
        console.error(e);
        next(e);
    }
});

module.exports = app;
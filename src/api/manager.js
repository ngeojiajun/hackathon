// Submission endpoint
const express = require("express");
const app = express.Router();
const db_conn = require("../db/PostgresConnection");

app.get("/",async function (req,res,next){
    try {
        let data = await db_conn.exec_single_query(`SELECT *,
            CASE
                WHEN c.vendor_id = 1 THEN COALESCE(c.vendor_name, 'Unknown')
                ELSE v.vendor_name
            END as vendor_name_expanded
            FROM claims.claims c inner join
            claims.vendor v using (vendor_id)
            inner join claims.employee e using (employee_id)
            where claim_status='pending'
            order by claim_date desc`
        );
        res.render('pending_approvals.ejs', {data});
    }
    catch(e) {
        console.error(e);
        next(e);
    }
});

app.post("/", async function (req, res, next){
    try {
        const {claim_id, submit, remarks} = req.body;
        let r = await db_conn.exec_query(async function (client){
            let q = await client.query(`UPDATE claims.claims
                SET claim_status = $1,
                remarks = $2
                WHERE claim_id = $3 AND
                claim_status = 'pending'`, [submit +'ed', remarks, claim_id]
            );
            return q.rowCount;
        });
        if(r) {
            res.type('html').end("Updated. <a href='/api/manager'>Click here to continue</a>");
        }
        else{
            res.end('Cannot update the claim :-(');
        }
    }
    catch(e) {
        console.error(e);
        next(e);
    }
});

app.get("/:xxx", async function (req,res,next){
    try {
        res.sendFile(
            './upload/'+req.params.xxx.replace(/([^/]*\/)/g,''),
            {
                root: process.cwd()
            }
        );
    }
    catch(e) {
        console.error(e);
        next(e);
    }
});

module.exports = app;
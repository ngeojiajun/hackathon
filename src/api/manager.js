// Submission endpoint
const express = require("express");
const app = express.Router();
const db_conn = require("../db/PostgresConnection");

async function render(res, additionalArgs={}){
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
    res.render('pending_approvals.ejs', {data,...additionalArgs});
}

app.get("/",async function (req,res,next){
    try {
        await render(res);
    }
    catch(e) {
        console.error(e);
        next(e);
    }
});

app.post("/", async function (req, res, next){
    try {
        let xxx = {
            approve : 'approved',
            reject : 'rejected'
        };
        const {claim_id, submit, remarks} = req.body;
        let r = await db_conn.exec_query(async function (client){
            let q = await client.query(`UPDATE claims.claims
                SET claim_status = $1,
                remarks = $2,
                last_updated = NOW()
                WHERE claim_id = $3 AND
                claim_status = 'pending'`, [xxx[submit], remarks, claim_id]
            );
            return q.rowCount;
        });
        if(r) {
            await render(res,{error_message:"Updated"});
        }
        else{
            await render(res,{error_message:"Cannot update the claim"});
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
            './uploads/'+req.params.xxx.replace(/([^/]*\/)/g,''),
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
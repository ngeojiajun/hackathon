const express = require("express");
/**
 * Database connection
 */
const db_conn = require("./db/PostgresConnection");

db_conn.init();

// Create the directories
{
    const fs = require('fs');
    if(!fs.existsSync('./uploads')) {
        fs.mkdirSync('./uploads');
    }
}

const app = express();
app.use(express.json());
app.use("/api", require('./api/_defs'));
app.set('view engine', 'ejs')
app.get("/",async function(req,res,next){
    let data = await db_conn.exec_single_query(`SELECT *,
        CASE
            WHEN c.vendor_id = 1 THEN COALESCE(c.vendor_name, 'Unknown')
            ELSE v.vendor_name
        END as vendor_name_expanded
        FROM claims.claims c inner join
        claims.vendor v using (vendor_id)
        inner join claims.employee e using (employee_id)
        ${req.query.id ? `WHERE e.employee_id = ${req.query.id | 0}` : ''}
        order by claim_date desc`
    );
    let employees = await db_conn.exec_single_query('SELECT * FROM claims.employee;');
    // res.end(`${JSON.stringify(test,null,2)}`);
    res.render("index.ejs",{data, employees, selected: req.query.id});
})

let server = app.listen(12345);

process.on("SIGTERM", function () {
    server?.close(db_conn.shutdown);
});
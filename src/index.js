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
app.get("/",async function(req,res,next){
    let test = await db_conn.exec_single_query("SELECT * FROM claims.claims");
    res.end(`${JSON.stringify(test,null,2)}`);
})

let server = app.listen(12345);

process.on("SIGTERM", function () {
    server?.close(db_conn.shutdown);
});
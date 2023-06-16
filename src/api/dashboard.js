const express = require('express');
const app = express.Router();
const metabase_query = require('../db/MetabaseQueryExecutor');

app.get('/:id(\\d+)', async function (req, res, next){
    const {from, to} = req.query;
    try {
        let result = await metabase_query.exec_metabase_query_by_index(req.params.id - 1,{
            claim_date : {from, to}
        });
        res.json(result);
    }
    catch (e) {
        if(e?.message === "Cannot find the query"){
            res.status(404).end("Cannot find the query");
            return;
        }
        next(e);
    }

});

module.exports = app;
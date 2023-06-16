/**
 * Contain the APIs to run queries compatible with metabase but not with postgres
 */

const db_conn = require("./PostgresConnection");
const queries = require("./DashboardQueries");
/**
 * Compile and execute the given matabase query
 * @param {string} query
 * @param {{[key:string]:string|string[]|{from:string,to:string}}} params - The parameters for the query, when it is scalar it will replace it, when it is array then it is considered as IN
 */
async function exec_metabase_query(query, params) {
    let replacement_args = [];
    if (/\bWHERE\b/i.test(query)) {
        //for each params given, try to expand it
        for (const key of Object.keys(params)) {
            let pattern = `{{${key}}}`;
            if (query.includes(pattern)) {
                const value = params[key];
                if (typeof value.at === "function") {
                    // String
                    replacement_args.push(value);
                    query = query.replaceAll(pattern, `$${replacement_args.length}`);
                    continue;
                }
                else if (Array.isArray(value)) {
                    let replacement = "";
                    for (const v of value) {
                        replacement_args.push(v);
                        replacement += `$${replacement_args.length},`;
                    }
                    query = query.replaceAll(pattern, `(${replacement.replace(/\,$/, '')})`);
                    continue;
                }
                else {
                    if (value.from && value.to) {
                        replacement_args.push(value.from, value.to);
                        query = query.replaceAll(pattern, ` ${key} BETWEEN $${replacement_args.length - 1} AND $${replacement_args.length} `);
                    }
                    else if (value.from) {
                        replacement_args.push(value.from);
                        query = query.replaceAll(pattern, ` ${key} >= $${replacement_args.length} `);
                    }
                    else if (value.to) {
                        replacement_args.push(value.to);
                        query = query.replaceAll(pattern, ` ${key} <= $${replacement_args.length} `);
                    }
                    else {
                        query = query.replaceAll(pattern, `TRUE`);
                    }
                }
            }
        }
    }
    return await db_conn.exec_single_query(query, replacement_args);
}

/**
 * Compile and execute the given matabase query which registered in DashboardQueries.js
 * @param {int} query
 * @param {{[key:string]:string|string[]|{from:string,to:string}}} params
 */
async function exec_metabase_query_by_index(idx, params) {
    const query = queries[idx];
    if(!query) {
        throw new Error("Cannot find the query");
    }
    return await exec_metabase_query(query, params);
}

module.exports = {
    exec_metabase_query,
    exec_metabase_query_by_index
}
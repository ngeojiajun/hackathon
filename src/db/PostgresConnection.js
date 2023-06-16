/**
 * Common tools to deal with the connection to postgres
 */
const { Pool, Client } = require('pg');

class PostgresConnection {
    constructor() { }
    /**
     * Setup the connection pool
     */
    init() {
        this.pool = new Pool({
            host: process.env.POSTGRES_SERVER,
            user: process.env.POSTGRES_USER,
            port: process.env.POSTGRES_PORT,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            idleTimeoutMillis: 30000,
        });
        this.pool.on("error", (err) => {
            console.error("Postgres: Something went wrong!!!!");
            console.error(err);
            process.exit(-1);
        });
    }
    /**
     * Shutdown the connection
     */
    async shutdown() {
        await this.pool.end();
    }
    /**
     * @callback query_exec
     * @param {Client} client
     * @returns {any}
     */
    /**
     * Perform query using the connection
     * @param {query_exec} query_exec
     */
    async exec_query(query_exec) {
        const client = await this.pool.connect();
        try {
            return await query_exec(client);
        } catch (e) {
            console.log(e.stack);
            return null;
        } finally {
            client.release();
        }
    }
    /**
     * Execute a simple query without need to deal with the client handle
     * @param {string} query
     * @param {any[]?} params
     * @returns {any[]}
     */
    async exec_single_query(query, params) {
        let result= await this.exec_query(async function(client){
            let result_set = await client.query(query, params);
            return result_set.rows;
        });
        if(result == null) {
            throw new Error("Query failed");
        }
        return result;
    }
}

module.exports = new PostgresConnection();

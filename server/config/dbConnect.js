require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const connectDB = async () => {
    try {
        const conn = await pool.connect();
        const checkTable = `
            CREATE TABLE IF NOT EXISTS "detected" (
                "id" SERIAL,
                "category" SMALLINT NOT NULL,
                "latitude" FLOAT NOT NULL,
                "longitude" FLOAT NOT NULL,
                "image_key" VARCHAR(255) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
                PRIMARY KEY ("id")
            );
        `;
        await pool.query(checkTable);
        console.log(`PostgreSQL Connected: ${conn.connectionParameters.database}`);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;
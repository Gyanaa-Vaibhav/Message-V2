import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const {Pool} = pkg

export const pool = new Pool({
    host: process.env.BD_HOSTNAME,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
})
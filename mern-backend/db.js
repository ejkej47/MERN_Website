const { Pool } = require("pg");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? { rejectUnauthorized: false } // na produkciji uključi SSL
    : false,                        // na lokalnom razvojnom serveru isključi SSL
});

module.exports = pool;

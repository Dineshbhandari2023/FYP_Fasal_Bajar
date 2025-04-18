require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER, // "root"
    password: process.env.DB_PASSWORD, // "Dinesh@123"
    database: process.env.DB_NAME, // "fasal_bajar"
    host: process.env.DB_HOST, // "localhost"
    dialect: process.env.DB_DIALECT, // "mysql"
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
};

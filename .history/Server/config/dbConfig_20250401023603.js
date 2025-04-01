// const { Sequelize } = require("sequelize");
// require("dotenv").config();

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: process.env.DB_DIALECT,
//     logging: false, // Set to true to see raw SQL queries
//   }
// );

// const checkConnection = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log(`DB Connected`.cyan.underline.bold);
//   } catch (error) {
//     console.error("Unable to connect to the database:".red.bold, error);
//   }
// };

// checkConnection();

// module.exports = sequelize;
// config/dbConfig.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

// Debug: log the DB_DIALECT to ensure it's a string
console.log("DB_DIALECT:", process.env.DB_DIALECT);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    // Force DB_DIALECT to be a string in case it's not already
    dialect: process.env.DB_DIALECT.toString(),
    logging: false, // Set to true to see raw SQL queries
  }
);

const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("DB Connected".cyan.underline.bold);
  } catch (error) {
    console.error("Unable to connect to the database:".red.bold, error);
  }
};

checkConnection();

module.exports = sequelize;

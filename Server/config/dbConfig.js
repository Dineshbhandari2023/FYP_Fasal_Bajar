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
// config/dbConfig.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT, // e.g., "mysql"
    logging: false,
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

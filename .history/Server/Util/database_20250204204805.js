const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("Fasal_Bajar", "root", "1234", {
  dialect: "mysql",
  host: "127.0.0.1",
});

const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(`DB Connected`.cyan.underline.bold);
  } catch (error) {
    console.error("Unable to connect to the database:".red.bold, error);
  }
};

checkConnection();

module.exports = sequelize;

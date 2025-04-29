module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("PaymentTransactions", "orderId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "Orders", key: "id" },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn("PaymentTransactions", "orderId");
  },
};

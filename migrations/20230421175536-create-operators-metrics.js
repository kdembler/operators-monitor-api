"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "operators_metrics",
      {
        time: {
          type: Sequelize.DATE,
          primaryKey: true,
        },
        dataObjectId: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        distributionBucketId: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        workerId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        nodeEndpoint: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        url: {
          type: Sequelize.STRING,
          allowNull: false,
          primaryKey: true,
        },
        status: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        responseTime: {
          type: Sequelize.FLOAT,
        },
        statusCode: {
          type: Sequelize.INTEGER,
        },
      },
      {}
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("operators_metrics");
  },
};

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      "SELECT create_hypertable('operators_metrics', 'time');"
    );
  },

  down: (queryInterface, Sequelize) => {
    return Promise.resolve();
  },
};

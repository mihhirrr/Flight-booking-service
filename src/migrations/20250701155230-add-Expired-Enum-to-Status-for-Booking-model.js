'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Bookings', 'status', {
      type: Sequelize.ENUM('Initiated', 'Booked', 'Canceled', 'Failed', 'Expired'),
      allowNull: false,
      defaultValue: 'Initiated'
    });
  },

  async down (queryInterface, Sequelize) {
    // Revert the ENUM to original state (without 'Expired')
    await queryInterface.changeColumn('Bookings', 'status', {
      type: Sequelize.ENUM('Initiated', 'Booked', 'Canceled', 'Failed'),
      allowNull: false,
      defaultValue: 'Initiated'
    });
  }
};

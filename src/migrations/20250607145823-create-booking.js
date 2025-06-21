'use strict';

/** @type {import('sequelize-cli').Migration} */

// Importing ENUMS instead of using raw strings
const { Enums } = require('../utils/common-utils');
const { INITIATED, BOOKED, CANCELLED, FAILED } = Enums.BookingStatus;

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      flightId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'flights',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.ENUM,
        values: [INITIATED, BOOKED, CANCELLED, FAILED],
        allowNull: false,
        defaultValue: INITIATED   
      },
      totalBookedSeats: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      bookingCharges: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Economy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      Business: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      FirstClass: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {

      await queryInterface.dropTable('Bookings');
  }
};
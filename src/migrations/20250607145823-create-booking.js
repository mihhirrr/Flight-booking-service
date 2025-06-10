'use strict';

/** @type {import('sequelize-cli').Migration} */

// Importing ENUMS instead of using raw strings
const { Enums } = require('../utils/common-utils');
const { CONFIRMED, CANCELLED, PENDING } = Enums.BookingStatus;

module.exports = {
  /**
   * @function up
   * @description Creates the 'Bookings' table with constraints and relationships.
   * @param {import('sequelize').QueryInterface} queryInterface - Sequelize QueryInterface instance
   * @param {typeof import('sequelize')} Sequelize - Sequelize constructor
   */
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
        values: [CONFIRMED, CANCELLED, PENDING],
        defaultValue: PENDING
      },
      totalBookedSeats: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      bookingCharges: {
        type: Sequelize.INTEGER,
        allowNull: false
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

  /**
   * @function down
   * @description Drops the 'Bookings' table during rollback.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {typeof import('sequelize')} Sequelize
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bookings');
  }
};
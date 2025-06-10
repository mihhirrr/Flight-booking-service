'use strict';

const { Model } = require('sequelize');
const { Enums } = require('../utils/common-utils');
const { CONFIRMED, CANCELLED, PENDING } = Enums.BookingStatus;

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * @function associate
     * @description Defines associations for the Booking model.
     * This is automatically called by Sequelize in the models/index file.
     * @param {object} models - Sequelize models
     */
    static associate(models) {
      // Each booking belongs to a flight
      this.belongsTo(models.flights, {
        foreignKey: 'id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
    }
  }

  Booking.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      flightId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'flights',
          key: 'id'
        }
      },
      status: {
        type: DataTypes.ENUM,
        values: [CONFIRMED, CANCELLED, PENDING]
      },
      totalBookedSeats: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      bookingCharges: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Booking'
    }
  );

  return Booking;
};
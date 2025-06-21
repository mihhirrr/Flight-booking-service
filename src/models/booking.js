'use strict';

const { Model } = require('sequelize');
const { Enums } = require('../utils/common-utils');
const { INITIATED, BOOKED, CANCELLED, FAILED } = Enums.BookingStatus;

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      
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
        values: [INITIATED, BOOKED, CANCELLED, FAILED],
        allowNull: false,
        defaultValue: INITIATED
      },
      totalBookedSeats: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      bookingCharges: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Economy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      Business: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      FirstClass: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      sequelize,
      modelName: 'Booking'
    }
  );

  return Booking;
};
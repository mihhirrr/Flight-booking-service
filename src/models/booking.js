'use strict';
const {
  Model
} = require('sequelize');
const { Enums } = require('../utils/common-utils')
const { CONFIRMED, CANCELLED, PENDING } = Enums.BookingStatus
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.flights, {
        foreignKey:'id',
        onUpdate:'CASCADE',
        onDelete:'CASCADE'
      })
    }
  }
  Booking.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull:false,
    },
    flightId: {
      type: DataTypes.INTEGER,
      allowNull:false,
      references: {
        model: 'flights',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM,
      values: [ CONFIRMED, CANCELLED, PENDING ]
    },
    totalBookedSeats: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    bookingCharges: {
      type: DataTypes.INTEGER,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
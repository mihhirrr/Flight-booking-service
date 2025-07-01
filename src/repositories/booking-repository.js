const { Booking } = require('../models');
const CrudFunctions = require('./crud-repository');
const AppError = require('../utils/Error-handler/AppError')
const StatusCodes = require('http-status-codes')

class BookingRepository extends CrudFunctions {

  constructor() {
    super(Booking);
  }

  async create(data, transaction ){
    try {
      const response = await this.model.create( data, { Transaction: transaction } );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async update(id, data, transaction) {
    try {
      const response = await this.model.update(data, {
        where: { id },
        transaction
      });

      if (!response[0]) {
        throw new AppError(
          `Resource not found for the ID ${id}`,
          StatusCodes.NOT_FOUND
        );
      }

      return response;
    } catch (error) {
      console.log(`Error updating data in ${this.model.name}`);
      throw error;
    }
  }

  async delete(id, transaction) {
    try {
      const response = await this.model.destroy({
        where: { id }
      }, { Transaction: transaction });

      if (!response) throw new AppError(`Resource not found for the ID ${id}`, StatusCodes.NOT_FOUND);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async cancelOldBookings(data, condition){
    try {
      const response = await Booking.update( data, condition )
      return response
    } catch (error) {
      throw error
    }
  }
}

module.exports = BookingRepository;
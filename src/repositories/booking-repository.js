const { Booking } = require('../models');
const CrudFunctions = require('./crud-repository');

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
}

module.exports = BookingRepository;
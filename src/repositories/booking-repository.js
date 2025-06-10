const { Booking } = require('../models');
const CrudFunctions = require('./crud-repository');

class BookingRepository extends CrudFunctions {
  /**
   * @constructor
   * @description Extends generic CRUD functions for the Booking model.
   */
  constructor() {
    super(Booking);
  }
}

module.exports = BookingRepository;
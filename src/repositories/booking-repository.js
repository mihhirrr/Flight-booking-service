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

  async delete(id, transaction) {
    console.log(id)
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
}

module.exports = BookingRepository;
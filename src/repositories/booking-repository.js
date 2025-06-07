const { Booking } = require('../models');
const { CrudFunctions } = require('./crud-repository')

class BookingRepository extends CrudFunctions{
    constructor(){
        super(Booking)
    }
}

module.exports = BookingRepository
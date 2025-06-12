const { BookingService } = require('../services')
const { Success, Error } = require('../utils/common-utils')

async function createBooking(req, res, next){
      const flightId = req.params.id;
      const selectedSeats = req.query.seats;

      try {
            const response = await BookingService.createBooking(flightId, selectedSeats);
            const SuccessResponse = { ...Success }
            SuccessResponse.message = response.data.message
            SuccessResponse.data = response.data.data
            return res.status(200).json(SuccessResponse)
      } catch (error) {
            console.log(error)
      }
}


module.exports = {
      createBooking
}
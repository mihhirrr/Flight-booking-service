const { BookingService } = require('../services')
const { Success, Error } = require('../utils/common-utils')

async function createBooking(req, res, next){
      const flightId = req.params.id;
      const selectedSeats = req.query.seats;

      try {
            const response = await BookingService.createBooking(flightId, selectedSeats);
            const SuccessResponse = { ...Success }
            SuccessResponse.data = response.data
            return res.status(200).json(SuccessResponse)
      } catch (error) {
            ErrorResponse = { ...Error }
            ErrorResponse.error.message = error.message;
            ErrorResponse.error.StatusCode = error.StatusCode;
            return res.status(error.StatusCode).json(ErrorResponse);
      }
}

module.exports = {
      createBooking
}
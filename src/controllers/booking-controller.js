const { BookingService } = require('../services')
const { Success, Error } = require('../utils/common-utils');
const { message } = require('../utils/common-utils/success');

async function createBooking(req, res, next){

      const data = { 
            userId: req.body.userId, 
            flightId: req.params.flightId, 
            selectedSeats: req.query.seats 
      }


      try {
            const response = await BookingService.createBooking(data);
            const SuccessResponse = { 
                  ...Success ,
                  data: response
            }
            return res.status(200).json(SuccessResponse)
      } catch (error) {
            const ErrorResponse = { 
                  ...Error ,
                  error: { 
                  message: error.message , 
                  StatusCode: error.StatusCode }
            }
            return res.status(500).json(ErrorResponse);
      }
 }

async function makePayment(req, res, next){

      const bookingID = parseInt(req.body.bookingID);
      const seats = req.body.seats

      try {
            const response = await BookingService.makePayment(bookingID, seats);
            const SuccessResponse = { 
                  ...Success ,
                  data: response
            }
            return res.status(200).json(SuccessResponse)
      } catch (error) {
            const ErrorResponse = { 
                  ...Error ,
                  error: { 
                  message: error.message , 
                  StatusCode: error.StatusCode }
            }
            return res.status(500).json(ErrorResponse);
      }

}

async function cancelBooking(req, res, next) {
      const bookingId = parseInt(req.params.bookingId);

      try {
            const response = await BookingService.cancelBooking(bookingId);
            const SuccessResponse = { 
                  ...Success ,
                  data: response
            }
            return res.status(200).json(SuccessResponse)
      } catch (error) {
            console.log(error)
            const ErrorResponse = { 
                  ...Error ,
                  error: { 
                  message: error.message , 
                  StatusCode: error.StatusCode }
            }
            return res.status(500).json(ErrorResponse);
      }
}

module.exports = {
      createBooking,
      makePayment,
      cancelBooking
}
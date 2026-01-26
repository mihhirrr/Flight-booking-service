const { BookingService } = require('../services')
const { Success, Error } = require('../utils/common-utils');
const { message } = require('../utils/common-utils/success');

//test route->

async function getBookingRoute(req, res, next) {
      res.json({
            message:"Booking route is functional."
      })
}

//test route end ^^

async function createBooking(req, res, next){
      const data = { 
            userId: parseInt(req.headers['x-user-id']), 
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
            return res.status(error.StatusCode || 500).json(ErrorResponse);
      }
 }

async function makePayment(req, res, next){

      const bookingID = parseInt(req.body.bookingID);
      const seats = req.body.seats
      const userId = parseInt(req.headers['x-user-id']);

      try {
            const response = await BookingService.makePayment(bookingID, seats, userId);
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
            return res.status(error.StatusCode || 500).json(ErrorResponse);
      }

}

async function cancelBooking(req, res, next) {
      const bookingId = parseInt(req.params.bookingId);
      const userId = parseInt(req.headers['x-user-id']);

      try {
            const response = await BookingService.cancelBooking(bookingId, userId);
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
            return res.status(error.StatusCode || 500).json(ErrorResponse);
      }
}

module.exports = {
      createBooking,
      makePayment,
      cancelBooking,
      getBookingRoute
}
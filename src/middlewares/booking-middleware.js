const StatusCodes = require('http-status-codes');
const { Error } = require('../utils/common-utils');

function validateBookingCreation(req, res, next){
      if(!req.body.userId || !req.params.flightId || !req.query.seats){
            const ErrorResponse = {
                  ...Error,
                  error: { message: 'User ID, Flight ID or Seat Selection not provided!'}
            }
            return res.status(StatusCodes.BAD_REQUEST)
                  .json(ErrorResponse)
      }
      next()
}

function PaymentMiddleware(req, res, next){
      if(!req.body.bookingID){
            const ErrorResponse = {
                  ...Error,
                  error: 'Booking ID not provided!'
            }
            return res.status(StatusCodes.BAD_REQUEST)
                  .json(ErrorResponse)
      }
      next()
}

module.exports = {
      validateBookingCreation,
      PaymentMiddleware
}
const StatusCodes = require('http-status-codes');
const { Error } = require('../utils/common-utils');
const { error, message } = require('../utils/common-utils/success');

const idempotencyStorage = {
}       // Storing idemp keys in memory for payment API

function validateBookingCreation(req, res, next){
      if(!req.params.flightId || !req.query.seats){
            const ErrorResponse = {
                  ...Error,
                  error: { message: 'Flight ID or Seat Selection not provided!'}
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

      // Idempotancy check
      const idempotencyKey = req.headers['x-idempotency-key']
      if(!idempotencyKey){
            const ErrorResponse = {
                  ...Error, 
                  error : {
                        message: 'Idempotency key missing!'
                  }
            }
            return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse)
      }
      if(idempotencyStorage[idempotencyKey]){
            const ErrorResponse = {
                  ...Error, 
                  error : {
                        message: 'Cannot retry a successful payment!'
                  }
            }
            return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse)
      }
      next()
}

module.exports = {
      validateBookingCreation,
      PaymentMiddleware
}
const StatusCodes = require('http-status-codes');
const { Error } = require('../utils/common-utils');
const { error, message } = require('../utils/common-utils/success');
const jwt = require('jsonwebtoken');
const { ServerConfig } = require('../config');
const AppError = require('../utils/Error-handler/AppError');

const idempotencyStorage = {
}       // Storing idemp keys in memory for payment API

function authenticateUser(req, res, next){
      try {
            const token = req.headers.authorization?.split(' ')[1]; // Bearer token
            
            if (!token) {
                  const ErrorResponse = {
                        ...Error,
                        error: { message: 'Authorization token is missing!' }
                  }
                  return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);
            }

            const decodedToken = jwt.verify(token, ServerConfig.JWT_SECRET);
            req.user = decodedToken; // Store user info in request
            next();
      } catch (error) {
            const ErrorResponse = {
                  ...Error,
                  error: {
                        message: error.message || 'Authentication failed!',
                        StatusCode: StatusCodes.UNAUTHORIZED
                  }
            }
            return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);
      }
}

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
      authenticateUser,
      validateBookingCreation,
      PaymentMiddleware
}
const { BookingService } = require('../services')
const { Success, Error } = require('../utils/common-utils');
const { message } = require('../utils/common-utils/success');
const { StatusCodes } = require('http-status-codes')

//test route->

async function getBookingRoute(req, res, next) {
      res.json({
            message:"Booking route is functional."
      })
}

//test route end ^^

//Create a new booking itenery
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

 //Get a single booking
async function getBookingById(req, res, next){
      const bookingId = parseInt(req.params.bookingId);
      const userId = parseInt(req.headers['x-user-id']);
      const userRole = req.headers['x-user-role'];

      try {
            const response = await BookingService.getBookingById(bookingId, userId, userRole);
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

//Get the bookings for a user. 
async function getAllBookingsForUser(req, res, next){
      const userId = parseInt(req.headers['x-user-id']);

      try {
            const response = await BookingService.getAllBookingsForUser(userId);
            const SuccessResponse = { 
                  ...Success ,
                  data: response
            }
            return res.status(StatusCodes.OK).json(SuccessResponse)
      } catch (error) {
            const ErrorResponse = { 
                  ...Error ,
                  error: { 
                  message: error.message , 
                  StatusCode: error.StatusCode }
            }
            return res.status(error.StatusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
      }
}

async function getAllBookings(req, res, next){
      try {
            const bookingStateFilter = req.query.state;
            const response = await BookingService.getAllBookings(bookingStateFilter);
            const SuccessResponse = { 
                  ...Success ,
                  data: response
            }
            return res.status(StatusCodes.OK).json(SuccessResponse)
      } catch (error) {
            const ErrorResponse = { 
                  ...Error ,
                  error: { 
                  message: error.message , 
                  StatusCode: error.StatusCode }
            }
            return res.status(error.StatusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
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
      const userRole = req.headers['x-user-role'];

      try {
            const response = await BookingService.cancelBooking(bookingId, userId, userRole);
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
      getBookingById,
      getAllBookingsForUser,
      getAllBookings,
      makePayment,
      cancelBooking,
      getBookingRoute
}
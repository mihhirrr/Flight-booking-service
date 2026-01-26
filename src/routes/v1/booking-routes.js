const express = require("express");
const Router = express.Router();
const { BookingController } = require('../../controllers')
const { BookingMiddleware } = require('../../middlewares')


Router.route('/health').get(BookingController.getBookingRoute)
Router.route('/payments')
            .post(BookingMiddleware.authenticateUser,
                  BookingMiddleware.PaymentMiddleware,
                  BookingController.makePayment)

Router.route('/:flightId')
            .post(BookingMiddleware.authenticateUser,
                  BookingMiddleware.validateBookingCreation,
                  BookingController.createBooking)

Router.route('/:bookingId/cancel')
            .patch(BookingMiddleware.authenticateUser,
                  BookingController.cancelBooking)

module.exports = Router
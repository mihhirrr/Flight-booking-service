const express = require("express");
const Router = express.Router();
const { BookingController } = require('../../controllers')
const { BookingMiddleware } = require('../../middlewares')


Router.route('/health').get(BookingController.getBookingRoute)
Router.route('/payments')
            .post(BookingMiddleware.PaymentMiddleware,
                  BookingController.makePayment)

Router.route('/:flightId')
            .post(BookingMiddleware.validateBookingCreation,
                  BookingController.createBooking)

Router.route('/:bookingId/cancel')
            .patch(BookingController.cancelBooking)

module.exports = Router
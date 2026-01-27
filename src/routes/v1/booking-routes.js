const express = require("express");
const Router = express.Router();
const { BookingController } = require('../../controllers')
const { BookingMiddleware, AuthMiddleware } = require('../../middlewares')


Router.route('/health').get(BookingController.getBookingRoute)
Router.route('/payments')
            .post(AuthMiddleware.isAuthenticated,
                  BookingMiddleware.PaymentMiddleware,
                  BookingController.makePayment)

Router.route('/:flightId')
            .post(AuthMiddleware.isAuthenticated,
                  BookingMiddleware.validateBookingCreation,
                  BookingController.createBooking)
Router.route('/:bookingId')
            .get(AuthMiddleware.isAuthenticated,
                  BookingController.getBookingById)
Router.route('/:bookingId/cancel')
            .patch(AuthMiddleware.isAuthenticated,
                  BookingController.cancelBooking)

module.exports = Router
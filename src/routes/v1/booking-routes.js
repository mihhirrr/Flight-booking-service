const express = require("express");
const Router = express.Router();
const { BookingController } = require('../../controllers')
const { BookingMiddleware, AuthMiddleware } = require('../../middlewares')
const { Enums } = require('../../utils/common-utils'); 
const { ADMIN, STAFF, CUSTOMER } = Enums.User_Profile;


Router.route('/health').get(BookingController.getBookingRoute)

Router.route('/my-bookings')
            .get(AuthMiddleware.isAuthenticated,
                 BookingController.getAllBookingsForUser)

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
                  AuthMiddleware.authorizeRoles(ADMIN, STAFF, CUSTOMER),
                  BookingController.cancelBooking)

Router.route('/')
            .get(AuthMiddleware.isAuthenticated,
                 AuthMiddleware.authorizeRoles(ADMIN, STAFF),
                 BookingController.getAllBookings)

module.exports = Router
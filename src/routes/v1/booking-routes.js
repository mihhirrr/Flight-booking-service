const express = require("express");
const Router = express.Router();
const { BookingController } = require('../../controllers')

Router.route('/:id')
      .post(BookingController.createBooking)

module.exports = Router
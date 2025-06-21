const { BookingService } = require('../services')
const { Success, Error } = require('../utils/common-utils');

async function createBooking(req, res, next){

      console.log('Inside create controller')
      const data = { 
            userId: req.body.userId, 
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
            return res.status(500).json(ErrorResponse);
      }
 }

async function makePayment(req, res, next){

      const bookingID = req.body.bookingID;

      try {
            const response = await BookingService.makePayment(parseInt(bookingID));
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
            return res.status(500).json(ErrorResponse);
      }

}

module.exports = {
      createBooking,
      makePayment
}
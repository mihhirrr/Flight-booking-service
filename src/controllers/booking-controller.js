      const { BookingService } = require('../services')
      const { Success, Error } = require('../utils/common-utils');

      async function createBooking(req, res, next){


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
                  ErrorResponse = { 
                        ...Error ,
                        error: { 
                        message: error.message , 
                        StatusCode: error.StatusCode 
                  }
            }
                  return res.status(500).json(ErrorResponse);
      }
}

      module.exports = {
            createBooking
}
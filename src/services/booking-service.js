const { BookingRepository } = require('../repositories')
const axios = require('axios')
const db = require('../models')
const { ServerConfig } = require('../config')
const AppError = require('../utils/Error-handler/AppError')
const { StatusCodes } = require('http-status-codes')


const bookingRepository = new BookingRepository()


const createBooking = async(id, selectedSeats)=>{

    const t = await db.sequelize.transaction();
        try {
            const Flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}api/flights/${id}`)
            const airplaneId = Flight.data.data.airplaneId
            const Airplane = await axios.get(`${ServerConfig.FLIGHT_SERVICE}api/airplanes/${airplaneId}`)
            
            const [Economy, Business, FirstClass] = selectedSeats.split('-')
            
            const AirplaneData = Airplane.data.data

            if( Economy > AirplaneData.EconomyCapacity || 
                Business > AirplaneData.BusinessClassCapacity || 
                FirstClass > AirplaneData.FirstClassCapacity ){
                    throw new AppError('Not enough Seats', StatusCodes.BAD_REQUEST)
            }

            console.log(
                Flight.data.data.Class_Fares
            )

            const EconomyFare = parseInt(Economy) * Flight.data.data.Class_Fares[0].farePrice
            const BusinessFare = parseInt(Economy) * Flight.data.data.Class_Fares[1].farePrice
            const FirstClasssFare = parseInt(Economy) * Flight.data.data.Class_Fares[2].farePrice
            console.log(EconomyFare + BusinessFare + FirstClasssFare)

            const Response = await axios.patch(
                `${ServerConfig.FLIGHT_SERVICE}api/flights/${id}/seats/?travelClass=${selectedSeats}&decrement=1`  // API Call to update the Seat Count in Airplane
            )
            await t.commit();
            return Response
        } catch (error) {  
            await t.rollback();
            throw error
    }
}

module.exports = {
    createBooking
}
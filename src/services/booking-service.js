const { BookingRepository } = require('../repositories')
const axios = require('axios')
const db = require('../models')
const { ServerConfig } = require('../config')
const AppError = require('../utils/Error-handler/AppError')
const { StatusCodes } = require('http-status-codes')


const bookingRepository = new BookingRepository()


const createBooking = async(data)=>{
    // console.log(data)

    const t = await db.sequelize.transaction();
        try {
            const Flight = await axios.get(
                `${ServerConfig.FLIGHT_SERVICE}api/flights/${data.flightId}`
            )   //get flight using flight ID
            const airplaneId = Flight.data.data.airplaneId
            const Airplane = await axios.get(
                `${ServerConfig.FLIGHT_SERVICE}api/airplanes/${airplaneId}`
            )  //get airplane using AirplaneID
            
            const [Economy, Business, FirstClass] = data.selectedSeats.split('-').map(s => parseInt(s))    //Split the seatselection 
            const AirplaneData = Airplane.data.data

            if( Economy > AirplaneData.EconomyCapacity || 
                Business > AirplaneData.BusinessClassCapacity || 
                FirstClass > AirplaneData.FirstClassCapacity ){
                    throw new AppError('Not enough Seats', StatusCodes.BAD_REQUEST)                         //reject the request if seat selection is higher
            }

            const EconomyFare = parseInt(Economy) * Flight.data.data.Class_Fares[0].farePrice
            const BusinessFare = parseInt(Business) * Flight.data.data.Class_Fares[1].farePrice
            const FirstClasssFare = parseInt(FirstClass) * Flight.data.data.Class_Fares[2].farePrice        // ^ Calculating the seat fare as per selection ^ 

            const bookingCharges = EconomyFare + BusinessFare + FirstClasssFare;
            const totalBookedSeats = Economy + Business+ FirstClass;

            await axios.patch(
                `${ServerConfig.FLIGHT_SERVICE}api/flights/${data.flightId}/seats/?decrement=1`,          // API Call to update the Seat Count in Airplane
                { travelClass: data.selectedSeats }   
            )                                                                                                  

           const bookingPayload = {...data, 
                totalBookedSeats,
                bookingCharges,
               }


            const response = await bookingRepository.create( bookingPayload , t )                            // Creating booking by calling overwrtiten create()

            await t.commit();
            return response
        } catch (error) {  
            await t.rollback()
            throw error
    }
}

module.exports = {
    createBooking
}
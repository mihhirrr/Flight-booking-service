const { BookingRepository } = require('../repositories')
const axios = require('axios')
const db = require('../models')
const { ServerConfig } = require('../config')
const AppError = require('../utils/Error-handler/AppError')
const { StatusCodes } = require('http-status-codes')


const bookingRepository = new BookingRepository()


const createBooking = async(data) => {
    // console.log(data)

    const t = await db.sequelize.transaction();
        try {
            const Flight = await axios.get(
                `${ServerConfig.FLIGHT_SERVICE}api/flights/${data.flightId}`                                //get flight using flight ID
            )   
            const airplaneId = Flight.data.data.airplaneId
            const Airplane = await axios.get(
                `${ServerConfig.FLIGHT_SERVICE}api/airplanes/${airplaneId}`                                //get airplane using AirplaneID
            )  
            
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
                Economy, 
                Business, 
                FirstClass
               }


            const response = await bookingRepository.create( bookingPayload , t )                            // Creating booking by calling overwrtiten create()

            await t.commit();
            return response
        } catch (error) {  
            await t.rollback()
            throw error
    }
}

const makePayment = async (bookingId) => {

    const t = await db.sequelize.transaction();
    
    try {
        const booking = await bookingRepository.find(bookingId)

        const currentDate = new Date()
        const bookingDate = new Date(booking.createdAt)

        if(currentDate.getTime() - bookingDate.getTime() >= 600000){        // Expiring the booking if payment not made withing 10 minutes
            await bookingRepository.delete(bookingId, t)                      // Deleting entry from bookings table

            const selectedSeats = `${booking.Economy}-${booking.Business}-${booking.FirstClass}`
            await axios.patch(
                `${ServerConfig.FLIGHT_SERVICE}api/flights/${booking.flightId}/seats/?decrement=0`,          // API Call to revert the Seat capacity in Airplane
                { travelClass: selectedSeats }
            )

            throw new AppError('Booking Expired!', StatusCodes.NOT_FOUND)
        }

        await t.commit();
        return true;
    } catch (error) {
        if(error.message === `Resource not found for the ID ${bookingId}`) error.message = 'Booking Id not found!'
        await t.rollback();
        throw error
    }
}

module.exports = {
    createBooking,
    makePayment
}
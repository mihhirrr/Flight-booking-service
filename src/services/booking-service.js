const { BookingRepository } = require('../repositories')
const axios = require('axios')
const db = require('../models')
const { ServerConfig } = require('../config')
const AppError = require('../utils/Error-handler/AppError')
const { StatusCodes } = require('http-status-codes')


const bookingRepository = new BookingRepository()

const { Enums } = require('../utils/common-utils')
const { BOOKED, FAILED, CANCELLED } = Enums.BookingStatus;

const createBooking = async(data) => {

    const t = await db.sequelize.transaction();
        try {
            const Flight = await axios.get(
                `${ServerConfig.FLIGHT_SERVICE}api/flights/${data.flightId}`                                //get flight using flight ID that including fare per class
            )   
            const FlightData = Flight.data.data;
            const airplaneId = FlightData.airplaneId
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


            const EconomyFare = parseInt(Economy) * FlightData.Class_Fares[0].farePrice
            const BusinessFare = parseInt(Business) * FlightData.Class_Fares[1].farePrice
            const FirstClasssFare = parseInt(FirstClass) * FlightData.Class_Fares[2].farePrice        // ^ Calculating the seat fare as per selection ^ 

            const bookingCharges = EconomyFare + BusinessFare + FirstClasssFare;
            const totalBookedSeats = Economy + Business+ FirstClass;

            await axios.patch(
                `${ServerConfig.FLIGHT_SERVICE}api/flights/${data.flightId}/seats/?decrement=1`,          // API Call to update the Seat Count in Airplane
                { travelClass: data.selectedSeats }   
            )                                                                                                  

           const bookingPayload = {
                ...data, 
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

const makePayment = async (bookingId, seats) => {

    const t = await db.sequelize.transaction();
    
    try {
        const booking = await bookingRepository.find(bookingId)

        if(booking.status === CANCELLED || booking.status === FAILED ) {
            throw new AppError('Booking already canceled! Please create a new itenery.', StatusCodes.GONE)
        }
        if(booking.status === BOOKED) throw new AppError('Booking already confirmed!', StatusCodes.BAD_REQUEST)

        const currentDate=  new Date()
        const bookingDate = new Date(booking.createdAt)

        if(currentDate.getTime() - bookingDate.getTime() >= 600000){                        // Expiring the booking if payment not made withing 10 minutes
            const expired = true
            await cancelBooking(bookingId, expired)

            throw new AppError('Booking Expired! Please create a new itenery.', 
                StatusCodes.GONE)
        }


        /* Some payment GW logic
        const PaymentResponse = await mimicingPaymentGatewayFunction()
        */

        /* Below will be wrapped in if.. block so that it should only be triggered if above payment logic is success,
         else throw error and do not update the booking and seat status 

         e.g. if(!PaymentResponse?.success){
            t.rollback();
            throw new AppError('Payment Failed!', StatusCodes.BAD_REQUEST)
         }else{
            // Beloww code
         }
         
         */

        await bookingRepository.update(bookingId, { status: BOOKED } , t );
        await axios.patch(                                                          // API call to udpate the Seat Status and set booking ID in Seats model
            `${ServerConfig.FLIGHT_SERVICE}api/seats`,
            {
                seats,
                BookingId: bookingId,
                status: BOOKED,
            }
        )

        await t.commit();
        return true;
    } catch (error) {
        if(error.message === `Resource not found for the ID ${bookingId}`) error.message = 'Booking not found!'
        await t.rollback();
        throw error
    }
}

const cancelBooking = async (bookingId, expired = false) =>{
    const t = await db.sequelize.transaction();

    try {
        const booking = await bookingRepository.find(bookingId)

        if(booking.status === 'Failed'){                                                        //Maybe I don't need this
            throw new AppError('Booking already Expired!', StatusCodes.GONE)
        }

        const status = expired? FAILED : CANCELLED;
        await bookingRepository.update(bookingId, { status } , t );

        const selectedSeats = `${booking.Economy}-${booking.Business}-${booking.FirstClass}`
        const response = await axios.patch(
            `${ServerConfig.FLIGHT_SERVICE}api/flights/${booking.flightId}/seats/?decrement=0`,          // API Call to revert the Seat capacity in Airplane
            { travelClass: selectedSeats }
        )

       if(!response?.data?.success){
            await t.rollback();
            throw new AppError('Seat update failed. Booking not cancelled.', 
                StatusCodes.INTERNAL_SERVER_ERROR)
       }

       await t.commit();
       return "Booking cancelled successfully!";

    } catch (error) {
        if(error.message === `Resource not found for the ID ${bookingId}`) error.message = 'Booking not found!'
        await t.rollback();
        throw error
    }
}

module.exports = {
    createBooking,
    makePayment,
    cancelBooking
}
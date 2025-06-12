const { BookingRepository } = require('../repositories')
const axios = require('axios')
const db = require('../models')
const { ServerConfig } = require('../config')


const bookingRepository = new BookingRepository()


const createBooking = async(id, selectedSeats)=>{

    const t = await db.sequelize.transaction();
        try {
            const flight = await axios.get(
                `${ServerConfig.FLIGHT_SERVICE}api/flights/${id}`
            );
            const Response = await axios.patch(
                `${ServerConfig.FLIGHT_SERVICE}api/flights/${id}/seats/?travelClass=${selectedSeats}&decrement=1`
            )
            await t.commit();
            return Response
        } catch (error) {   
            await t.rollback();
            console.log(error)
    }
}

module.exports = {
    createBooking
}
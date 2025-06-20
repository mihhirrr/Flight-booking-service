const express = require('express');

const { ServerConfig } = require('./config');
const { BookingRouter } = require('./routes')

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use('/api/bookings', BookingRouter);

app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});

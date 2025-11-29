const express = require('express');

const { ServerConfig } = require('./config');
const { BookingRouter } = require('./routes')
const { CRON } = require('./utils/common-utils')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/bookings', BookingRouter);

app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
    console.log('Running cron test now...')
    // CRON()
});
// Import Winston
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

/**
 * @function customFormat
 * @description Defines the log message format for output.
 */
const customFormat = printf(({ level, message, timestamp, error }) => {
    return `${timestamp} : ${level}: ${message}`;
});

/**
 * @constant {import('winston').Logger} logger
 * @description Configured Winston logger instance with timestamped console and file transports.
 */
const logger = createLogger({
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customFormat,
    ),
    transports: [
        new transports.Console(),                      // Logs to console
        new transports.File({ filename: 'combined.log' }) // Logs to file
    ],
});

module.exports = logger;
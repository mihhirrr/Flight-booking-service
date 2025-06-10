// Loaded environment variables from a .env file into process.env
require("dotenv").config();

/**
 * @constant {string|undefined} PORT
 * @description Application port retrieved from environment variables.
 */
const PORT = process.env.PORT;

module.exports = { PORT };
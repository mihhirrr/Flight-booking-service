const { StatusCodes } = require('http-status-codes');
const { Error } = require('../utils/common-utils');

const isAuthenticated = async(req, res, next) => {
    // Assuming authentication has already happened at the API Gateway
    // and relevant user info is passed in headers.
    // Here, we just check for the presence of x-user-id
    const userId = req.headers['x-user-id'];

    if(!userId){
      return res.status(StatusCodes.UNAUTHORIZED).json({
        ...Error,
        message: "Unauthorized: User ID not found in headers!",
        error: {
          message: "Missing authentication information.",
        },
      });
    }
    // User is authenticated, proceed.
    next();
};

module.exports = {
  isAuthenticated
};

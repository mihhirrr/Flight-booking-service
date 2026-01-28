const { StatusCodes } = require('http-status-codes');
const { Error, Enums } = require('../utils/common-utils'); // Updated import
const { ADMIN, STAFF, CUSTOMER } = Enums.User_Profile; // Destructure all relevant roles

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

// Generic role-based authorization middleware
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.headers['x-user-role'];
        console.log(userRole)
        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(StatusCodes.FORBIDDEN).json({
                ...Error,
                message: "Forbidden: You do not have the necessary permissions to access this resource!",
                error: {
                    message: "Insufficient role privileges.",
                },
            });
        }
        next();
    };
};

module.exports = {
  isAuthenticated,
  authorizeRoles // Export the generic middleware
};
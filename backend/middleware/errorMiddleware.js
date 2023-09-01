function errorHandler(err, req, res, next) {
    // Default error status code is 500 (Internal Server Error)
    const statusCode = err.statusCode || 500;
    // Default error message
    const message = err.message || 'Something went wrong';

    // Log the error for debugging (you can customize this based on your needs)
    console.error(err.stack);

    // Set the response status code and send the error message
    res.status(statusCode).json({
        error: true,
        message: message,
    });
}

module.exports = { errorHandler };

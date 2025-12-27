const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    logger.error(`${err.message} | ${req.originalUrl}`);
    res.status(statusCode).json({
        success: false, message: err.message, stack: process.env.NODE_ENV === 'prod' ? null : err.stack,
    });
};

const notFound = (req, res, next) => {
    res.status(404); next(new Error(`Not Found - ${req.originalUrl}`));
};

module.exports = { errorHandler, notFound };
// const logging = require('./logging');
const commonErrors = {
    "ValidationError": 400,
};


const statusCodes = {
    400: ' validation Error',
    401: 'Unauthorized',
    409: ' already exists'
};


exports.handler = (err, req, res) => {
    // res.status(err.status || err.statusCode || 500);
    console.log(err);
    let message, statusCode;
    const error_type = err.name;
    message = err.error || err.message;
    statusCode = commonErrors[error_type] || err.status || err.statusCode || 500;
    if (!message)
        message = statusCodes[statusCode] || ' validation Error';
    // Raven.captureException(err, {
    //     req: req,
    //     level: 'warn'
    // });
    res.status(statusCode);
    return res.json({
        message: message
    });
};


exports.logInitRequest = (req, res, next) => {
    // logging.info(req, 'Calling ' + req.method + ' ' + req.url + ' api function.');
    next();
};


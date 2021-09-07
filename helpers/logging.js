const winston = require('winston');
const expressWinston = require('express-winston');
require('winston-daily-rotate-file');
const config = require('config');
const logFileConfig = config.get('logFile');
expressWinston.emitErrs = true;
const colorize = true;

//Initializing the File Transport. New File will be generated based on the datePattern
const fileTransport = new winston.transports.DailyRotateFile(logFileConfig);

// const emailTransport = new winston.transports.Mail(smtp);

const consoleTransport = new winston.transports.Console({
    level: 'debug',
    colorize,
    timestamp: true,
    handleExceptions: true,
})

basicTransportObj = {
    transports: [
        fileTransport,
        consoleTransport
    ]
}



logFileConfig.dirname = __dirname + '/../' + logFileConfig.dirname;

//Express request logger
const requestLogger = expressWinston.logger({
    transports: basicTransportObj.transports,
    msg: "[ {{req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress|| '' }} ] : " + "[ {{req.headers.requestId}} {{req.headers.distinctId}} {{(req.user ? req.user.id : 'GUEST')}} ] " + "{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime }}ms",
    statusLevels: true,
});
//basic logger
const logger = new winston.createLogger({
    // exitOnError : false,
    transports: basicTransportObj.transports,
    format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple(),
    winston.format.splat(),
    // myFormat
    ),
    exceptionHandlers: [
        // emailTransport
    ]
});

//Express error logger
const errorLogger = expressWinston.errorLogger({
    transports: basicTransportObj.transports
        // Using sentry instead
        // exceptionHandlers: [
        //     emailTransport
        // ]
});
// const logger = new winston.Logger();
const info = (req, msg) => {
    var message = extractLogMessage(req, msg);
    logger.info(message);
}
const error = (req, msg) => {
    var message = extractLogMessage(req, msg);
    logger.error(message);
}
const warn = (req, msg) => {
    var message = extractLogMessage(req, msg);
    logger.warn(message);
}
const log = (req, msg) => {
    var message = extractLogMessage(req, msg);
    logger.log(message);
}
const verbose = (req, msg) => {
    var message = extractLogMessage(req, msg);
    logger.verbose(message);
}
const debug = (req, msg) => {
    var message = extractLogMessage(req, msg);
    logger.debug(message);
}
const silly = (req, msg) => {
    var message = extractLogMessage(req, msg);
    logger.silly(message);
}

const extractLogMessage = (req, msg) => {
    if (req == null) {
        return msg;
    }
    var message;
    var userId = (req.user ? req.user.id : 'GUEST'); //TODO : take out from req auth
    var clientIp = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    var metadata = ''; // TODO : to be decided
    message = '[ ' + clientIp + ' ] - [ ' + (req.headers.requestId || '') + ' ' + (req.headers.distinctId || '') + ' ' + userId + ' ] : ' + (JSON.stringify(msg) || '') + metadata;
    return message;
}


module.exports = {
    requestLogger,
    errorLogger,
    error,
    warn,
    info,
    log,
    verbose,
    debug,
    silly
};
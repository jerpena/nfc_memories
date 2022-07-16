import 'dotenv/config';
import winston from 'winston';
const { LOG_LEVEL = info } = process.env;

const logFormat = winston.format.printf(function (info) {
    const date = new Date().toISOString();
    return `${date}-${info.level}: ${info.message}`;
});

const logger = winston.createLogger({
    level: LOG_LEVEL,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.splat(),
        winston.format.simple(),
        // logFormat
    ),
    transports: [
        new winston.transports.Console()]
});

export default logger;
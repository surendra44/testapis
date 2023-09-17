const winston = require('winston')

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    enumerateErrorFormat(),
    winston.format.colorize(),
    winston.format.splat(),
    winston.format.timestamp(),
    winston.format.printf(({timestamp, level, message,req }) => {
        const requestInfo = req ? ` | Request URL: ${req.url}` : '';
        return `${timestamp} [${level}] ${requestInfo} : ${message}`
    })
  ),
  transports: [
    new winston.transports.Console({
     level:"info"
    }),
    new winston.transports.Console( {level:"error"} ),
    new winston.transports.File({ filename: 'error-logs.log', level:"error" }),
  ],
});


module.exports = logger;

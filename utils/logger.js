import winston from 'winston';
import { format } from 'winston';

export default winston.createLogger({
  format: format.combine(
    format.timestamp({
      format: 'DD-MM-YYYY HH:mm:ss',
    }),
    format.printf(({ timestamp, message }) => {
      return `${timestamp}\t${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs.log' }),
  ],
});
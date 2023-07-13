import logger from '../utils/logger.js';

export default (req, res, next) => {
  const logMessage = `${req.method} ${req.originalUrl} ${req.ip}`;
  logger.info(logMessage);
  next();
}

import mongoose from 'mongoose';
import ResponseError from '../errors/ResponseError.js';

export default (err, req, res, next) => {
  if (err instanceof ResponseError) {
    return res.status(err.status).json({ error: 'Client Error', message: err.message });
  }
  
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ error: 'Validation Error', message: err.message });
  }
  
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: 'Cast Error', message: err.message });
  }
  
  return res.status(500).json({ error: 'Internal Server Error', message: 'Something went wrong.' });
};

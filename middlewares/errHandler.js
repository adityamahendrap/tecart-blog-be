import mongoose from 'mongoose';

export default (err, req, res, next) => {
  console.log(err); 
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).send({ message: err.message });
  }
  
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).send({ message: err.message });
  }

  return res.status(500).send(err);
  // return res.status(500).send({ message: 'Internal Server Error' });
};

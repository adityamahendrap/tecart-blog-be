import * as jose from "jose";
import User from '../models/user.js';
import ResponseError from "../utils/responseError.js";

export default async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new ResponseError(400, "Token not found")
  }
  try {
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    
    const user = await User.findById(payload.userId).select('email username')
    if (!user) {
      throw new ResponseError(403, "Invalid token or unauthorized")
    }
    
    req.user = { ...user._doc, _id: user._id.toString() };
    next();
  } catch (err) {
    next(err);
  }
};

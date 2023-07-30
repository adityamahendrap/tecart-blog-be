import * as jose from "jose";
import User from '../models/user.js';

export default async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(400).json({ message: "Token not found" });
  }
  try {
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    
    const user = await User.findById(payload.userId).select('email username')
    if (!user) {
      throw new Error();
    }
    
    const strUserId = user._id.toString();
    req.user = { ...user._doc, _id: strUserId };
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token" });
  }
};

import ResponseError from "../errors/ResponseError.js";

export default async (req, res, next) => {
  if(req.user.authType !== 'JWT') {
    throw new ResponseError(490, "User with OAuth cannot access this feature");
  }
  next();
}

import * as jose from "jose";
import * as argon2 from "argon2";
import emailService from '../services/email.service.js';
import randomstring from "randomstring";
import logger from "../utils/logger.js";
import User from "../models/user.model.js";
import ResponseError from "../errors/ResponseError.js";
import axios from "axios";
import qs from "qs";
import path from '../routes/path.js';

const authService = {
  hashPassword: async (password) => {
    return await argon2.hash(password);
  },

  compareHash: async (hash, original) => {
    return await argon2.verify(hash, original);
  },

  register: async (username, email, password, confirmPassword) => {
  try {
      const isEmailExist = await User.findOne({ email });
      if (isEmailExist) {
        throw new ResponseError(409, "Email is already registered");
      }
      if(!password) { // validate bcs passwd nullable for OAuth
        throw new ResponseError(400, "Password are required");
      }
      if (password !== confirmPassword) {
        throw new ResponseError(400, "Password confirmation is not matched");
      }
      const hashedPassword = await authService.hashPassword(password);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
      await newUser.save();

      logger.info("authService.register -> User created");
      return newUser;
    } catch (err) {
      throw err;
    }
  },

  login: async (email, pasword) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new ResponseError(404, "User doesn't exist");
      }
      if(user.authType !== 'JWT') {
        throw new ResponseError(400, "You are registered with OAuth. if you want to login, not by this method");
      }

      const validPassword = await authService.compareHash(
        user.password,
        pasword
      );
      if (!validPassword) {
        throw new ResponseError(400, "Invalid password");
      }
      const token = await new jose.SignJWT({ userId: user._id })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime(process.env.JWT_EXPIRES_IN ?? "1h")
        .sign(new TextEncoder().encode(process.env.JWT_SECRET));

      logger.info("authService.login -> User logged In");
      return token;
    } catch (err) {
      throw err;
    }
  },

  verifyToken: async (token) => {
    if (!token) {
      throw new ResponseError(404, "Token not found");
    }
    try {
      const { payload } = await jose.jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
      const user = await User.findOne({ _id: payload.userId }).select(
        "email -_id"
      );
      if (!user) {
        return res.status(400).send({ message: "Invalid token" });
      }

      logger.info("authService.verifyToken -> Token verified");
      return user;
    } catch (err) {
      throw err;
    }
  },

  resetPassword: async (email) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new ResponseError(404, "Email not registered");
      }
      if(user.authType !== 'JWT') {
        throw new ResponseError(400, "Can't reset password for OAuth user");
      }

      const resetPassword = randomstring.generate();
      const text = `Password has been reseted.\nYour new password: ${resetPassword}\nPlease remember to change this password. `;
      const emailSended = await emailService.sendEmail(email, "Reset Password", text);
      if (!emailSended) {
        logger.info("authService.resetPassword -> Send email failed");
        throw new ResponseError(
          500,
          "Failed sending email reset password, please try again"
        );
      }

      const hashedResetPassword = await authService.hashPassword(resetPassword);
      const result = await User.updateOne(
        { email },
        { password: hashedResetPassword }
      );

      logger.info("authService.verifyToken -> Token verified");
      return result;
    } catch (err) {
      throw err;
    }
  },

  changePassword: async (userId, currentPassword, newPassword) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ResponseError(404, "User not found");
      }
      if(user.authType !== 'JWT') {
        throw new ResponseError(400, "Can't change password for OAuth user");
      }

      const validCurrentPassword = await authService.compareHash(
        user.password,
        currentPassword
      );
      if (!validCurrentPassword) {
        throw new ResponseError(400, "Invalid current password");
      }
      if (currentPassword === newPassword) {
        throw new ResponseError(
          400,
          "The current password and the new password are still the same"
        );
      }

      const hashedNewPassword = await authService.hashPassword(newPassword);
      const result = await User.updateOne(
        { userId },
        { password: hashedNewPassword }
    );

      logger.info("authService.changePassword -> User changed password");
      return result;
    } catch (err) {
      throw err;
    }
  },

  getGithubOathToken: async ({ code }) => {
    const rootUrl = "https://github.com/login/oauth/access_token";
    const options = {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    };
    const queryString = qs.stringify(options);
  
    try {
      const { data } = await axios.post(`${rootUrl}?${queryString}`, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      const decoded = qs.parse(data);
  
      return decoded;
    } catch (err) {
      throw err
    }
  },
  
  getGithubUser: async ({ access_token }) => {
    try {
      const { data } = await axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
  
      return data;
    } catch (err) {
      throw err
    }
  },

  getGoogleOauthToken: async ({ code }) => {
    const rootURl = "https://oauth2.googleapis.com/token";
  
    const options = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.API_ENDPOINT}/api${path.GOOGLE_OAUTH}`,
      grant_type: "authorization_code",
    };
    
    try {
      const { data } = await axios.post(
        rootURl,
        qs.stringify(options),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
  
      return data;
    } catch (err) {
      console.log("Failed to fetch Google Oauth Token");
      throw err
    }
  },

  getGoogleUser: async ({ id_token, access_token }) => {
    try {
      const { data } = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
        headers: { Authorization: `Bearer ${id_token}` },
      });
  
      return data;
    } catch (err) {
      throw err
    }
  }
};

export default authService;

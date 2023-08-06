import * as jose from "jose";
import * as argon2 from "argon2";
import sendEmail from "../utils/sendEmail.js";
import randomstring from "randomstring";
import logger from "../utils/logger.js";
import User from "../models/user.model.js";
import ResponseError from "../errors/ResponseError.js";
import axios from "axios";
import qs from "qs";

const authService = {
  register: async (username, email, password, confirmPassword) => {
    try {
      const isEmailExist = await User.findOne({ email });
      if (isEmailExist) {
        throw new ResponseError(409, "Email is already registered");
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
      logger.error("ERROR authService.register ->", err);
      throw err;
    }
  },

  login: async (email, pasword) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new ResponseError(404, "User doesn't exist");
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
      logger.error("authService.login ->", err);
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
      logger.error("authService.verifyToken ->", err);
      throw err;
    }
  },

  resetPassword: async (email) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new ResponseError(404, "Email not registered");
      }

      const resetPassword = randomstring.generate();
      const text = `Password has been reseted.\nYour new password: ${resetPassword}\nPlease remember to change this password. `;
      const emailSended = await sendEmail(email, "Reset Password", text);
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
      logger.error("authService.resetPassword ->", err);
      throw err;
    }
  },

  changePassword: async (userId, currentPassword, newPassword) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ResponseError(404, "User not found");
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
      logger.error("authService.changePassword ->", err);
      throw err;
    }
  },

  // Retrieve the OAuth Access Token
  githubOathToken: async (code) => {
    const rootUrl = "https://github.com/login/oauth/access_token";
    const options = {
      client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
      client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
      code,
    };
    const queryString = qs.stringify(options);

    try {
      const { data } = await axios.post(`${rootUrl}?${queryString}`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      const decoded = qs.parse(data);

      logger.error(
        "sessionService.getGithubOathToken -> Success get github oauth token"
      );
      return decoded;
    } catch (err) {
      logger.error("ERROR sessionService.getGithubOathToken ->", err);
      throw err;
    }
  },

  // Retrieve the GitHub Account Information
  githubUser: async (access_token) => {
    try {
      const { data } = await axios.get("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      return data;
    } catch (err) {
      logger.error("ERROR sessionService.getGithubUser ->", err);
      throw err;
    }
  },

  hashPassword: async (password) => {
    return await argon2.hash(password);
  },

  compareHash: async (hash, original) => {
    return await argon2.verify(hash, original);
  },
};

export default authService;

import User from "../models/user.model.js";
import authService from "../services/auth.service.js";
import emailService from "../services/email.service.js";

export default {
  register: async (req, res, next) => {
    const { username, email, password, confirmPassword } = req.body;
    try {
      const createdUser = await authService.register(
        username,
        email,
        password,
        confirmPassword
      );
      res
        .status(201)
        .send({
          message:
            "Register success, please check your email to verify your account",
        });

      // send email confirmation
      const verificationEndpoint = `${process.env.API_ENDPOINT}/api/auth/verify-email/${createdUser._id}`;
      await emailService.sendEmail(
        createdUser.email,
        "Email Verification",
        verificationEndpoint
      );
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const token = await authService.login(email, password);
      return res.status(200).send({ token });
    } catch (err) {
      next(err);
    }
  },

  sendEmailVerification: async (req, res, next) => {
    const { _id, email } = req.user;
    try {
      const verificationEndpoint = `${process.env.API_ENDPOINT}/api/auth/verify-email/${_id}`;
      await emailService.sendEmail(
        email,
        "Email Verification",
        verificationEndpoint
      );

      return res
        .status(200)
        .send({ message: "Varification sent, please check your email" });
    } catch (err) {
      next(err);
    }
  },

  verifyToken: async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).send({ message: "Token not found" });
    }

    try {
      const email = await authService.verifyToken(token);
      return res.status(200).send(email);
    } catch (err) {
      next(err);
    }
  },

  verifyEmail: async (req, res, next) => {
    const { id } = req.params;
    try {
      await User.updateOne({ _id: id }, { isVerified: true });
      return res.status(201).send({ message: "Email verified" });
    } catch (err) {
      next(err);
    }
  },

  resetPassword: async (req, res, next) => {
    const { email } = req.body;
    try {
      await authService.resetPassword(email);
      return res
        .status(201)
        .send({ message: "Password reseted, please check your email" });
    } catch (err) {
      next(err);
    }
  },

  changePassword: async (req, res, next) => {
    let { currentPassword, newPassword } = req.body;
    const { _id } = req.user;
    try {
      await authService.changePassword(_id, currentPassword, newPassword);
      return res.status(201).send({ message: "Password updated" });
    } catch (err) {
      next(err);
    }
  },
};

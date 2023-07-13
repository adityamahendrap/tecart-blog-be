import * as jose from "jose";
import * as argon2 from "argon2";
import sendEmail from '../utils/sendEmail.js';
import randomstring from 'randomstring';
import logger from '../utils/logger.js';
import User from '../models/user.js';

export default {
  register: async (req, res, next) => {
    const { password, confirmPassword }= req.body;
    
    if(password !== confirmPassword) {
      return res.status(400).send({ message: "Password confirmation is not matched"})
    }
    const hashedPassword = await argon2.hash(password);
    req.body.password = hashedPassword
    
    try {
      const newUser = new User(req.body)
      await newUser.save()
    
      logger.info("User created");
      return res.status(201).send({ message: "User created" })
    } catch (err) {
      next(err)
    }
  },

  login: async (req, res, next) => {
    const { email, password } = req.body

    try {
      const user = await User.findOne({ email })
      if (!user) {
          return res.status(404).send({ message: 'User does not exist' })
      }

      const validPassword = await argon2.verify(user.password, password)
      if (!validPassword) {
          return res.status(400).send({ message: 'Invalid password' })
      }
      const token = await new jose.SignJWT({ userId: user._id }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime(process.env.JWT_EXPIRES_IN ?? '1h').sign(new TextEncoder().encode(process.env.JWT_SECRET))
      return res.status(200).send({ token })
    } catch (err) {
      next(err)
    }
  },

  verifyToken: async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return res.status(400).send({ message: 'Token not found' })
    }
    try {
      const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
      const user = await User.findOne({ _id: payload.userId }).select("email -_id")
      if (!user) {
        return res.status(400).send({ message: 'Invalid token' })
      }

      logger.info("User get verify token");
      return res.status(200).send(user)
    } catch (err) {
      next(err)
    }
  },

  sendEmailVerification: async (req, res, next) => {
    const { _id, email } = req.user
    
    const verificationEndpoint = `${process.env.API_ENDPOINT}/api/auth/verify-email/${_id}`
    try {
      const emailSended = await sendEmail(email, "Email Verification", verificationEndpoint)
      if(!emailSended) {
        logger.info("Send email failed");
        return res.status(500).send({ message: "Failed sending email verification" })
      }
      
      logger.info("Verification code sended");
      return res.status(201).send({ message: "Verification code sent, please check your email" })
    } catch (err) {
      next(err)
    }
  },

  verifyEmail: async (req, res, next) => {
    const { id } = req.params

    try {
      await User.updateOne({ _id: id }, { isVerified: true })

      logger.info("User verified an email");
      return res.status(201).send({ message: "Email verified" })
    } catch (err) {
      next(err)
    }
  },

  resetPassword: async (req, res, next) => {
    const { email } = req.body

    try {
      const user = await User.findOne({ email })
      if(!user) return res.status(404).send({ message: "Email not registered"})

      const resetPassword = randomstring.generate()
      const text = `Password has been reseted.\nYour new password: ${resetPassword}\nPlease remember to change this password. `
      const emailSended = await sendEmail(email, "Reset Password", text, res)
      if(!emailSended) {
        logger.info("Send email failed");
        res.status(500).send({ message: "Failed sending email reset password, please try again" })
      }

      const hashedResetPassword = await argon2.hash(resetPassword)
      await User.updateOne({ email }, { password: hashedResetPassword })

      logger.info("User reseted the password");
      return res.status(201).send({ message: "Password reseted, please check your email" })
    } catch (err) {
      next(err)
    }
  },

  changePassword: async (req, res, next) => {
    let { currentPassword, newPassword } = req.body
    const { _id } = req.user
    
    try {
      const user = await User.findById(_id)
      if(!user) {
        return res.status(404).send({ message: "User not found" })
      }

      const validCurrentPassword = await argon2.verify(user.password, currentPassword)
      if(!validCurrentPassword) {
        return res.status(400).send({ message: "Invalid current password" })
      }
      if(currentPassword === newPassword) {
        return res.status(400).send({ message: "The current password and the new password are still the same"})
      }

      const hashedNewPassword = await argon2.hash(newPassword);
      await User.updateOne({ _id }, { password: hashedNewPassword })

      logger.info("User changed password");
      res.status(201).send({ message: "Password updated"})
    } catch (err) {
      next(err)
    }
  },
};

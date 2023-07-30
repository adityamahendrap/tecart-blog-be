import nodemailer from "nodemailer";
import logger from "../utils/logger.js";

const EmailService = {
  sendEmail: async (email, subject, text) => {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: process.env.EMAIL_SERVICE,
      port: process.env.EMAIL_PORT,
      secure: true,
      // logger: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    try {
      const sendEmail = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        text,
      });

      if(!sendEmail.accepted && !sendEmail.accepted.length > 0) {
        throw new ResponseError(500, 'Send email failed')
      }

      logger.info('emailService.sendEmail -> Email sended')
      return null
    } catch (err) {
      logger.error("ERROR emailService.sendEmail ->", err);
      throw err;
    }
  },
}

export default EmailService
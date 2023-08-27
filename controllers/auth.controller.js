import User from "../models/user.model.js";
import authService from "../services/auth.service.js";
import emailService from "../services/email.service.js";
import userService from "../services/user.service.js";
import * as jose from "jose";

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
      res.status(201).send({message:"Register success, please check your email to verify your account",});

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

  resendEmailVerification: async (req, res, next) => {
    const { _id, email } = req.user;
    try {
      const verificationEndpoint = `${process.env.API_ENDPOINT}/api/auth/verify-email/${_id}`;
      await emailService.sendEmail(
        email,
        "Email Verification",
        verificationEndpoint
      );

      return res.status(200).send({ message: "Varification sent, please check your email" });
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
      return res.status(201).send({ message: "Password reseted, please check your email" });
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


  // !! Frontend redirect example, 
  // 🧢 you should attach this function to your oauth github login button
  // export function getGitHubUrl(from) {
  //   const rootURl = "https://github.com/login/oauth/authorize";
  
  //   const options = {
  //     client_id: import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID, //DOMAIN/api/auth/github
  //     redirect_uri: import.meta.env.VITE_GITHUB_OAUTH_REDIRECT_URL,
  //     scope: "user:email",
  //     state: from,
  //   };
  
  //   const qs = new URLSearchParams(options);
  
  //   return `${rootURl}?${qs.toString()}`;
  // }

  githubOauth: async (req, res, next) => {
    const { code, state, error } = req.query
    try {
      const pathUrl = state ?? "/"
  
      if (error) {
        return res.redirect(`${FRONTEND_ORIGIN}/login`);
      }
  
      if (!code) {
        return res.status(401).json({
          status: "error",
          message: "Authorization code not provided!",
        });
      }
  
      const { access_token } = await authService.getGithubOathToken({ code });
      const { email, avatar_url, login } = await authService.getGithubUser({ access_token });
      
      if(!email) {
        return res.status(403).json({
          status: "fail",
          message: "You GitHub account does not have any public email address, please add one and try again",
        });
      }
      
      const userData = {
        email,
        username: login,
        profile: { picture: avatar_url },
        password: " ",
        isVerified: true,
        authType: "GitHub",
      }
      const user = await userService.updateOrInsertUser(userData)

      if (!user) {
        return res.redirect(`${process.env.FRONTEND_ORIGIN}/oauth/error`);
      }

      const token = await new jose.SignJWT({ userId: user._id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(process.env.JWT_EXPIRES_IN ?? "1h")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));
  
      res.cookie("token", token, {
        expires: new Date(Date.now() + 60 * 60 * 1000),
      });
  
      res.redirect(`${process.env.FRONTEND_ORIGIN}${pathUrl}`);
    } catch (err) {
      console.error("Failed to authorize GitHub User:", err);
      return res.redirect(`${process.env.FRONTEND_ORIGIN}/oauth/error`);
    }
  },

  // !! Frontend redirect example, 
  // 🧢 you should attach this function to your oauth google login button
  // export const getGoogleUrl = (from) => {
  //   const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`;

  //   const options = {
  //     redirect_uri: import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT, //DOMAIN/api/auth/google
  //     client_id: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
  //     access_type: "offline",
  //     response_type: "code",
  //     prompt: "consent",
  //     scope: [
  //       "https://www.googleapis.com/auth/userinfo.profile",
  //       "https://www.googleapis.com/auth/userinfo.email",
  //     ].join(" "),
  //     state: from,
  //   };
  
  //   const qs = new URLSearchParams(options);
  
  //   return `${rootUrl}?${qs.toString()}`;
  // };
  
  googleOauth: async (req, res) => {
    const { code, state } = req.query
    try {
      const pathUrl = state || "/";
  
      if (!code) {
        return res.status(401).json({
          status: "fail",
          message: "Authorization code not provided!",
        });
      }
  
      const { id_token, access_token } = await authService.getGoogleOauthToken({ code });
      const { name, verified_email, email, picture } = await authService.getGoogleUser({ id_token, access_token });
  
      if (!verified_email) {
        return res.status(403).json({
          status: "fail",
          message: "Google account not verified",
        });
      }

      const userData = {
        email,
        username: name,
        profile: { picture },
        password: null,
        isVerified: true,
        authType: "Google"
      }
      const user = await userService.updateOrInsertUser(userData)

      if (!user) return res.redirect(`${process.env.FRONTEND_ORIGIN}/oauth/error`);
  
      const token = await new jose.SignJWT({ userId: user._id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(process.env.JWT_EXPIRES_IN ?? "1h")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));
  
      res.cookie("token", token, {
        expires: new Date(Date.now() + 60 * 60 * 1000),
      });
  
      res.redirect(`${process.env.FRONTEND_ORIGIN}${pathUrl}`);
    } catch (err) {
      console.log("Failed to authorize Google User:", err);
      return res.redirect(`${process.env.FRONTEND_ORIGIN}/oauth/error`);
    }
  },


  // !! Frontend redirect example,
  // 🧢 you should attach this function to your oauth facebook login button
  // const stringifiedParams = queryString.stringify({
  //   client_id: process.env.APP_ID_GOES_HERE,
  //   redirect_uri: 'https://www.example.com/authenticate/facebook/',
  //   scope: ['email', 'user_friends'].join(','), // comma seperated string
  //   response_type: 'code',
  //   auth_type: 'rerequest',
  //   display: 'popup',
  // });
  // const facebookLoginUrl = `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`;
  facebookOauth: async (req, res, next) => {
    try {
      console.log(req.query);
      res.send("ok");
    } catch (err) {
      throw err
    }
  },

  logout: async (req, res, next) => {
    try {
      res.cookie("token", "", { maxAge: -1 });
      res.status(200).json({ status: "success" });
    } catch (err) {
      next(err)
    }
  }
}

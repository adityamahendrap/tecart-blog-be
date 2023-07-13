import { Router } from "express";
import authController from "../controllers/auth.js";
import verifyUser from "../middlewares/verifyUser.js";
const router = Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/verify-token", authController.verifyToken);
router.get("/verify-email/:id", authController.verifyEmail);

router.use(verifyUser);
router.get("/send-email-verification", authController.sendEmailVerification);
router.put("/change-password", authController.changePassword);
router.put("/reset-password", authController.resetPassword);
router.put("/logout");

export default router;

import { Router } from "express";
import userController from "../controllers/user.js";
import verifyUser from '../middlewares/verifyUser.js';
const router = Router();

router.get("/", verifyUser, userController.list);
router.get("/:id", verifyUser, userController.get);
router.put("/:id", verifyUser, userController.update);
router.delete("/:id", verifyUser, userController.delete);

export default router;

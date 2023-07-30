import { Router } from "express";
import followController from '../controllers/follow.js';
import verifyUser from "../middlewares/verifyUser.js";
const router = Router();

router.get("/user/:userId", verifyUser, followController.list);
router.post("/", verifyUser, followController.create);
router.delete("/:id", verifyUser, followController.delete);

export default router;

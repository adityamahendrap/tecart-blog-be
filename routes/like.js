import { Router } from "express";
import likeController from '../controllers/like.js';
import verifyUser from "../middlewares/verifyUser.js";
const router = Router();

router.get("/post/:postId", verifyUser, likeController.list);
router.post("/", verifyUser, likeController.create);
router.delete("/:id", verifyUser, likeController.delete);

export default router;

import { Router } from "express";
import likeController from '../controllers/like.js';
const router = Router();

router.get("/post/:postId", likeController.list);
router.post("/", likeController.create);
router.delete("/:id", likeController.delete);

export default router;

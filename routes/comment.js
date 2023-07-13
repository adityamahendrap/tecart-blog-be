import { Router } from "express";
import commentController from '../controllers/comment.js';
const router = Router();

router.get("/post/:postId", commentController.list);
router.post("/", commentController.create);
router.put("/:id", commentController.update);
router.delete("/:id", commentController.delete);

export default router;
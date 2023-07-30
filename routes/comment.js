import { Router } from "express";
import verifyUser from '../middlewares/verifyUser.js';
import commentController from '../controllers/comment.js';
const router = Router();

router.get("/post/:postId", verifyUser, commentController.list);
router.post("/", verifyUser, commentController.create);
router.put("/:id", verifyUser, commentController.update);
router.delete("/:id", verifyUser, commentController.delete);

export default router;
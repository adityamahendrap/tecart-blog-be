import { Router } from "express";
import postController from '../controllers/post.js';
import verifyUser from '../middlewares/verifyUser.js';
const router = Router();

router.get("/", verifyUser, postController.list);
router.get("/:id", verifyUser, postController.get);
router.get("/related/:id", verifyUser, postController.related);
router.post("/", verifyUser, postController.create);
router.put("/:id", verifyUser, postController.update);
router.delete("/:id", verifyUser, postController.delete);

export default router;

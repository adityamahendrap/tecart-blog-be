import { Router } from "express";
import postController from '../controllers/post.js';
const router = Router();

router.get("/", postController.list);
router.get("/:id", postController.get);
router.get("/related/:id", postController.related);
router.post("/", postController.create);
router.put("/:id", postController.update);
router.delete("/:id", postController.delete);

export default router;

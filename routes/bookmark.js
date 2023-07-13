import { Router } from "express";
import bookmarkController from '../controllers/bookmark.js';
const router = Router();

router.get("/", bookmarkController.list);
router.post("/", bookmarkController.create);
router.delete("/:id", bookmarkController.delete);

export default router;

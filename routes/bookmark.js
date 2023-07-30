import { Router } from "express";
import bookmarkController from '../controllers/bookmark.js';
import verifyUser from '../middlewares/verifyUser.js';
const router = Router();

router.get("/", verifyUser, bookmarkController.list);
router.post("/", verifyUser, bookmarkController.create);
router.delete("/:id", verifyUser, bookmarkController.delete);

export default router;

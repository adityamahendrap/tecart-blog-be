import { Router } from "express";
import verifyUser from '../middlewares/verifyUser.js';
import feedController from '../controllers/feed.js';
const router = Router();

router.get("/", verifyUser, feedController.relevant);
router.get("/latest", verifyUser, feedController.latest);
router.get("/top", verifyUser, feedController.top);

export default router;

import { Router } from "express";
import feedController from '../controllers/feed.js';
const router = Router();

router.get("/", feedController.relevant);
router.get("/latest", feedController.latest);
router.get("/top", feedController.top);

export default router;

import { Router } from "express";
import followController from '../controllers/follow.js';
const router = Router();

router.get("/user/:userId", followController.list);
router.post("/", followController.create);
router.delete("/:id", followController.delete);

export default router;

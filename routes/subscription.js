import { Router } from "express";
import subscriptionController from "../controllers/subscription.js";
import verifyUser from '../middlewares/verifyUser.js';
const router = Router();

router.get("/", verifyUser, subscriptionController.list);
router.post("/", verifyUser, subscriptionController.create);
router.delete("/:id", verifyUser, subscriptionController.delete);

export default router;

import { Router } from "express";
import subscriptionController from "../controllers/subscription.js";
const router = Router();

router.get("/", subscriptionController.list);
router.post("/", subscriptionController.create);
router.delete("/:id", subscriptionController.delete);

export default router;

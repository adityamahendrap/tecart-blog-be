import { Router } from "express";
import shareController from '../controllers/share.js';
const router = Router();

router.get("/user/:userId", shareController.list);
router.post("/", shareController.create);
router.put("/:id", shareController.update);
router.delete("/:id", shareController.delete);

export default router;

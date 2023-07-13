import { Router } from "express";
import categoryController from '../controllers/category.js';
const router = Router();

router.get("/", categoryController.list);
router.post("/", categoryController.create);
router.put("/:id", categoryController.update);
router.delete("/:id", categoryController.delete);

export default router;

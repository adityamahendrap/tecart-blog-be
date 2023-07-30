import { Router } from "express";
import categoryController from '../controllers/category.js';
import verifyUser from '../middlewares/verifyUser.js';
const router = Router();

router.get("/", verifyUser, categoryController.list);
router.post("/", verifyUser, categoryController.create);
router.put("/:id", verifyUser, categoryController.update);
router.delete("/:id", verifyUser, categoryController.delete);

export default router;

import { Router } from "express";
import shareController from '../controllers/share.js';
import verifyUser from '../middlewares/verifyUser.js';
const router = Router();

router.get("/user/:userId", verifyUser, shareController.list);
router.post("/", verifyUser, shareController.create);
router.put("/:id", verifyUser, shareController.update);
router.delete("/:id", verifyUser, shareController.delete);

export default router;

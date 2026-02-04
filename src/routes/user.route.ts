import { Router } from "express";
import { authenticate, authorize } from "../middlewares";

import { updateUser, findUserById, getAllUsers, deleteUser, updateAvatar } from "../controllers/user.controller";
import { uploadSingle } from "../middlewares/upload.middleware";
const router = Router();

router.put("/", authenticate, updateUser);
router.put("/avatar", authenticate, uploadSingle, updateAvatar);
router.get("/", authenticate, authorize('admin'), getAllUsers);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);
router.get("/:id", authenticate, authorize('admin'), findUserById);

export default router;
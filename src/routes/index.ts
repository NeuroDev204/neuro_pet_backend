import { Router } from "express";
import authRoutes from "./auth.route";
import userRoutes from './user.route'
import petRoutes from './pet.route'
const router = Router();


router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/pets", petRoutes);
export default router;

import { Router } from "express";
import { validateCreatePet } from "../middlewares/pet.middleware";
import { authenticate } from "../middlewares";
import { createPet } from "../controllers/pet.controller";

const router = Router();
router.post("/", validateCreatePet, authenticate, createPet);

export default router;
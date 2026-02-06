import { Request, Response } from "express";
import { ApiResponse, asyncHandler } from "../utils";
import { CreatePetDto } from "../types/pet.types";
import { PetService } from "../services/pet.service";

export const createPet = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user!._id;
  const data: CreatePetDto = req.body;
  data.ownerId = ownerId;
  await PetService.createPet(data);
  res.status(201).json(ApiResponse.success({
    message: "Create pet successfully",
    data: data
  }));
});
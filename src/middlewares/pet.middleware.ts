import { NextFunction, Request, Response } from "express";
import { CreatePetDto } from "../types/pet.types";
import { ApiError } from "../errors/ApiError";
import { ErrorCode } from "../errors/error-codes";

export const validateCreatePet = (req: Request, res: Response, next: NextFunction) => {
  const { name, species, age, gender, ownerId } = req.body as Partial<CreatePetDto>;
  if (!name || !species || !age || !gender) {
    throw new ApiError(ErrorCode.MISSING_REQUIRED_FIELD);
  }
  const allowedSpecies = ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'other'];
  if (!allowedSpecies.includes(species)) {
    throw new ApiError(ErrorCode.INVALID_SPECIES);
  }
  if (!['male', 'female'].includes(gender)) {
    throw new ApiError(ErrorCode.INVALID_GENDER);
  }
  if (typeof age !== 'number' || age < 0) {
    throw new ApiError(ErrorCode.AGE_BE_A_POSITIVE);
  }
  req.body = { name, species, age, gender, ownerId } as CreatePetDto;
  next();
}
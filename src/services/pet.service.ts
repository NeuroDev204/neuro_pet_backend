import { ApiError } from "../errors/ApiError";
import { ErrorCode } from "../errors/error-codes";
import { UserRepository } from "../repositories";
import { PetDocument, PetRepository } from "../repositories/pet.repository";
import { CreatePetDto } from "../types/pet.types";

export class PetService {
  static async createPet(data: CreatePetDto): Promise<PetDocument> {
    const { name, species, age, gender, ownerId } = data;
    const user = UserRepository.findById(data.ownerId.toString());
    if (!user) {
      throw new ApiError(ErrorCode.USER_NOT_FOUND);
    }
    // create pet via repo
    const pet = await PetRepository.create({
      name,
      species,
      age,
      gender,
      ownerId
    });
    return pet;
  }
}
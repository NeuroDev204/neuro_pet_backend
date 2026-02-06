import { HydratedDocument } from "mongoose";
import { IPet, Pet } from "../models/pet.model";
import { CreatePetDto } from "../types/pet.types";

export type PetDocument = HydratedDocument<IPet>;

export class PetRepository {
  static async findById(petId: string, selectFields?: string): Promise<PetDocument | null> {
    const query = Pet.findById(petId);
    if (selectFields) {
      return query.select(selectFields)
        .exec() as Promise<PetDocument | null>;
    }
    return query.exec() as Promise<PetDocument | null>;
  }
  static async create(data: CreatePetDto & Partial<IPet>): Promise<PetDocument> {
    data.createdAt = new Date(Date.now());
    data.updatedAt = new Date(Date.now());
    return Pet.create(data) as Promise<PetDocument>;
  }
  

}
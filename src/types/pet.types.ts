import { IPet } from "../models/pet.model";
import { IUser } from "../models/user.model";

export type CreatePetDto = Pick<IPet, 'name' | 'species' | 'age' | 'gender' | 'ownerId'>
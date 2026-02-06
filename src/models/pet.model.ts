import { Schema, model, Document, Types } from 'mongoose';

// ============= PET INTERFACES =============
export interface IVaccination {
  vaccineName: string;
  date: Date;
  nextDueDate?: Date;
  veterinarianId?: Types.ObjectId;
  notes?: string;
}

export interface IMedication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  prescribedBy?: Types.ObjectId; // Vet ID
}

export interface IMedicalHistory {
  vaccinations: IVaccination[];
  allergies: string[];
  chronicConditions: string[];
  medications: IMedication[];
  surgeries?: {
    type: string;
    date: Date;
    performedBy?: Types.ObjectId;
    notes?: string;
  }[];
}

export interface IPet extends Document {
  _id: Types.ObjectId;
  ownerId: Types.ObjectId;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster' | 'other';
  breed?: string;
  age: number; // in months
  dateOfBirth?: Date;
  gender: 'male' | 'female';
  weight?: number; // in kg
  color?: string;
  microchipId?: string;
  medicalHistory: IMedicalHistory;
  profileImage?: string; // URL or path
  createdAt: Date;
  updatedAt: Date;
}

// ============= SUB-SCHEMAS =============
const vaccinationSchema = new Schema<IVaccination>({
  vaccineName: {
    type: String,
    required: [true, 'Vaccine name is required']
  },
  date: {
    type: Date,
    required: [true, 'Vaccination date is required']
  },
  nextDueDate: { type: Date },
  veterinarianId: {
    type: Schema.Types.ObjectId,
    ref: 'Vet'
  },
  notes: { type: String, maxlength: 500 }
}, { _id: false });

const medicationSchema = new Schema<IMedication>({
  name: {
    type: String,
    required: [true, 'Medication name is required']
  },
  dosage: {
    type: String,
    required: [true, 'Dosage is required']
  },
  frequency: {
    type: String,
    required: [true, 'Frequency is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    default: Date.now
  },
  endDate: { type: Date },
  prescribedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Vet'
  }
}, { _id: false });

const surgerySchema = new Schema({
  type: {
    type: String,
    required: [true, 'Surgery type is required']
  },
  date: {
    type: Date,
    required: [true, 'Surgery date is required']
  },
  performedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Vet'
  },
  notes: { type: String, maxlength: 1000 }
}, { _id: false });

const medicalHistorySchema = new Schema<IMedicalHistory>({
  vaccinations: {
    type: [vaccinationSchema],
    default: []
  },
  allergies: {
    type: [String],
    default: []
  },
  chronicConditions: {
    type: [String],
    default: []
  },
  medications: {
    type: [medicationSchema],
    default: []
  },
  surgeries: {
    type: [surgerySchema],
    default: []
  }
}, { _id: false });

// ============= MAIN SCHEMA =============
const petSchema = new Schema<IPet>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner ID is required'],
      index: true
    },
    name: {
      type: String,
      required: [true, 'Pet name is required'],
      trim: true,
      minlength: [1, 'Name must be at least 1 character'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    species: {
      type: String,
      required: [true, 'Species is required'],
      enum: {
        values: ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'other'],
        message: '{VALUE} is not a valid species'
      },
      index: true
    },
    breed: {
      type: String,
      trim: true,
      maxlength: [100, 'Breed cannot exceed 100 characters']
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [0, 'Age must be 0 or greater'],
      max: [600, 'Age cannot exceed 600 months (50 years)']
    },
    dateOfBirth: {
      type: Date,
      validate: {
        validator: function (v: Date) {
          return v <= new Date();
        },
        message: 'Date of birth cannot be in the future'
      }
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: {
        values: ['male', 'female'],
        message: '{VALUE} is not a valid gender'
      }
    },
    weight: {
      type: Number,
      min: [0.1, 'Weight must be at least 0.1 kg'],
      max: [500, 'Weight cannot exceed 500 kg']
    },
    color: {
      type: String,
      trim: true,
      maxlength: [50, 'Color description cannot exceed 50 characters']
    },
    microchipId: {
      type: String,
      unique: true,
      sparse: true, // Allow null values while maintaining uniqueness
      trim: true,
      uppercase: true
    },
    medicalHistory: {
      type: medicalHistorySchema,
      default: () => ({
        vaccinations: [],
        allergies: [],
        chronicConditions: [],
        medications: [],
        surgeries: []
      })
    },
    profileImage: {
      type: String,
      validate: {
        validator: function (v: string) {
          // Basic URL validation
          return !v || /^https?:\/\/.+/.test(v) || /^\/uploads\/.+/.test(v);
        },
        message: 'Invalid image URL format'
      }
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete (ret as any).__v;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

// ============= INDEXES =============
petSchema.index({ ownerId: 1, isActive: 1 });
petSchema.index({ microchipId: 1 }, { unique: true, sparse: true });
petSchema.index({ species: 1 });
petSchema.index({ name: 1, ownerId: 1 });

// ============= VIRTUALS =============
// Calculate age in years
petSchema.virtual('ageInYears').get(function () {
  return Math.floor(this.age / 12);
});

// Get upcoming vaccinations
petSchema.virtual('upcomingVaccinations').get(function () {
  const now = new Date();
  return this.medicalHistory.vaccinations
    .filter(v => v.nextDueDate && v.nextDueDate > now)
    .sort((a, b) => a.nextDueDate!.getTime() - b.nextDueDate!.getTime());
});

export const Pet = model<IPet>('Pet', petSchema);
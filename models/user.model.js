import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userProfileSchema = new mongoose.Schema(
  {
    name: String,
    bio: String,
    picture: String,
    location: String,
    links: { type: [String], required: false },
  },
  { _id: false }
);

const userPreferenceSchema = new mongoose.Schema(
  {
    tags: { type: [String] , default: [] },
    categoryIds: { type: [String], default: [] }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true }, 
    password: { type: String }, // not required for OAuth
    username: { type: String, unique: true, required: true },
    profile: userProfileSchema,
    isVerified: { type: Boolean, default: false },
    authType: { type: String, enum: ['Google', 'GitHub', 'JWT'], default: 'JWT' },
    preference: userPreferenceSchema
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
userSchema.plugin(uniqueValidator);

export default mongoose.model("User", userSchema);

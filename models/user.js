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

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    profile: userProfileSchema,
    isVerified: { type: Boolean, default: false },
    oauth: { type: String, enum: ['Google', 'Github', null], default: null },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
userSchema.plugin(uniqueValidator);

export default mongoose.model("User", userSchema);

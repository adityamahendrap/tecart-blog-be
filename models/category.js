import mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      minLength: 1
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
categorySchema.plugin(uniqueValidator)

export default mongoose.model("Category", categorySchema);

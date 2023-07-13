import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minLength: 1 },
    slug: { type: String, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: { type: String, required: true, minLength: 1 },
    content: { type: String, required: true, minLength: 1 },
    readingTime: Number,
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: [String],
    status: { type: String, enum: ["Draft", "Published"], default: "Draft" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
postSchema.plugin(uniqueValidator);

export default mongoose.model("Post", postSchema);

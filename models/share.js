import mongoose from "mongoose";

const shareSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    content: { type: String, trim: true },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model("Share", shareSchema);

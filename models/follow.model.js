import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
  {
    doerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model("Follow", followSchema);

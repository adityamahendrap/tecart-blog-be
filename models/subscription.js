import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    subscriberId: {
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
    versionKey: false,
  }
);

export default mongoose.model("Subscription", subscriptionSchema);

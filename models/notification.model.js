import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: [
        'Like', // notif if someone likes your post
        'Comment', // notif if someone comments on your post
        'Follow',  // notif if someone follows you
        'Share',  // notif if someone share your post
        'Subscription', // notif if subscribed author posting a new post
      ],
      required: true,
    },
    key: {
      type: mongoose.Schema.Types.Mixed,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
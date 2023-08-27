import logger from "../utils/logger.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Follow from "../models/follow.model.js";
import Notification from "../models/notification.model.js";
import ResponseError from "../errors/ResponseError.js";

// Like
notificationService.createNotification(userId, 'Like', {
  postId,
  doerId,
})

// Comment
notificationService.createNotification(userId, 'Comment', {
  postId,
  doerId,
  commentId,
})

// Follow
notificationService.createNotification(userId, 'Follow', {
  doerId
})

// Subscription
notificationService.createNotification(userId, 'Subscription', {
  authorId,
  postId,
})

const notificationService = {
  getNotifications: async (userId) => {
    try {
      const notifications = await Notification.find({ userId }).sort({
        createdAt: -1,
      });

      await Promise.all(
        notifications.map(async (notification) => {
          if(notification.type === 'Like') 
          {
            const { title } = await Post.findById(notification.key.postId).select('title');
            const { username } = await User.findById(notification.key.doerId).select('username');
            notification.info = { title, username }
            notification.message = `${username} liked your post "${title}"`;
          }
          else if(notification.type === 'Comment') 
          {
            const { title } = await Post.findById(notification.key.postId).select('title')
            const { username } = await User.findById(notification.key.doerId).select('username')
            const { content } = await Comment.findById(notification.key.commentId).select('content')
            notification.info = { title, username, content }
            notification.message = `${username} commented on your post "${title}"`
          }
          else if(notification.type === 'Follow') 
          {
            const { username } = await User.findById(notification.key.doerId).select('username')
            notification.info = { username }
            notification.message = `${username} followed you`
          }
          else if(notification.type === 'Subscription') 
          {
            const { title } = await Post.findById(notification.key.postId).select('title')
            const { username } = await User.findById(notification.key.authorId).select('username')
            notification.info = { title, username }
            notification.message = `${username} posted a new post "${title}"`
          }
        })
      )

      return notifications;
    } catch (err) {
      throw err;
    }
  },

  createNotification: async (userId, type, key) => {
    try {
      const notification = new Notification({
        userId,
        type,
        key,
      })
      await notification.save();

      return notification;
    } catch (err) {
      throw err;
    }
  },

  countUnreadNotifications: async (userId) => {
    try {
      const count = await Notification.countDocuments({
        userId,
        isRead: false,
      });
      return count;
    } catch (err) {
      throw err;
    }
  },

  readNotification: async (notificationId) => {
    try {
      const notification = await Notification.findById(notificationId);
      if (!notification) {
        throw new ResponseError(404, "Notification not found");
      }

      notification.isRead = true;
      await notification.save();

      return notification;
    } catch (err) {
      throw err;
    }
  },

  readAllUnreadNotifications: async (userId) => {
    try {
      const notifications = await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true }
      );
      return notifications;
    } catch (err) {
      throw err;
    }
  },

  deleteNotification: async (notificationId) => {
    try {
      const notification = await Notification.findByIdAndDelete(notificationId);
      if (!notification) {
        throw new ResponseError(404, "Notification not found");
      }

      return notification;
    } catch (err) {
      throw err;
    }
  },
};

export default notificationService;

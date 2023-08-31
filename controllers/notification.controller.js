import notificationService from "../services/notification.service.js";
import setCache from "../utils/setCache.js";

export default {
  list: async (req, res, next) => {
    const userId = req.user._id;
    try {
      const notifications = await notificationService.getNotifications(userId);
      setCache(req, notifications);
      return res.status(200).send({ message: "My notifications retrieved", data: notifications });
    } catch (err) {
      throw err
    }
  },

  countUnread: async (req, res, next) => {
    const userId = req.user._id;
    try {
      const notifications = await notificationService.countUnreadNotifications(userId);
      return res.status(200).send({ message: "My unread notifications retrieved", data: notifications });
    } catch (err) {
      throw err
    }
  },

  read: async (req, res, next) => {
    const { id } = req.params;
    try {
      const notifications = await notificationService.readNotification(id);
      return res.status(200).send({ message: "Notifications readed", data: notifications });
    } catch (err) {
      throw err
    } 
  },

  readAll: async (req, res, next) => {
    const userId = req.user._id;
    try {
      const notifications = await notificationService.readAllUnreadNotifications(userId);
      return res.status(200).send({ message: "All notifications readed", data: notifications });
    } catch (err) {
      throw err
    }
  },

  delete: async (req, res, next) => {
    const { id } = req.params;
    try {
      const notifications = await notificationService.deleteNotification(id);
      return res.status(200).send({ message: "Notifications deleted", data: notifications });
    } catch (err) {
      throw err
    }
  }

}
import setCache from "../utils/setCache.js";
import userService from "../services/user.service.js";

export default {
  get: async (req, res, next) => {
    const userId = req.user._id;
    const { targetId } = req.params;
    try {
      const subscription = await userService.getSubscriptionByUser(
        userId,
        targetId
      );
      setCache(req, subscription);
      return res
        .status(200)
        .send({ message: "Subscription retrieved", data: subscription });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    const subscriberId = req.user._id;
    const { targetId } = req.params;
    try {
      const subscription = await userService.subscribe(subscriberId, targetId);
      return res
        .status(201)
        .send({ message: "Subscription created", data: subscription });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    const { id } = req.params;
    try {
      const deleted = await userService.unsubscribe(id);
      return res
        .status(200)
        .send({ message: "Subscription deleted", data: deleted });
    } catch (err) {
      next(err);
    }
  },
};

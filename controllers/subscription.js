import logger from "../utils/logger.js";
import pagination from "../utils/pagination.js";
import setCache from "../utils/setCache.js";
import Subscription from '../models/subscription.js';

export default {
  list: async (req, res, next) => {
    const { limit, skip, subscriberId, targetId } = req.query;
    
    const filter = {}
    if(subscriberId) filter.subscriberId = subscriberId
    if(targetId) filter.targetId = targetId

    try {
      const subscriptions = await Subscription.find(filter)
      const total = subscriptions.length
      
      logger.info("User accessed subscriptions");
      // setCache(req, next, data)
      return res.status(200).send({ message: "Subscriptions retrieved", total, data: subscriptions });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    const subscriberId = req.user._id
    
    if(subscriberId === req.body.targetId) {
      return res.status(400).send({ message: "Self-subscription is not permitted" })
    }

    try {
      const subscription = new Subscription({ ...req.body, subscriberId })
      await subscription.save()

      logger.info("User created a subscription");
      return res.status(201).send({ message: "Subscription created", data: subscription });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    const { id } = req.params;

    try {
      const subscription = await Subscription.findByIdAndDelete(id)
      if(!subscription) {
        return res.status(404).send({ message: "Subscription not found" })
      }
      
      logger.info("User deleted subscription");
      return res.status(200).send({ message: "Subscription deleted" });
    } catch (err) {
      next(err);
    }
  },
};

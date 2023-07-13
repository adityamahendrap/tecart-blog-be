import logger from "../utils/logger.js";
import pagination from "../utils/pagination.js";
import setCache from "../utils/setCache.js";
import Share from '../models/share.js';

export default {
  list: async (req, res, next) => {
    const { limit, skip } = req.query;
    const { userId } = req.params;
    
    if(userId == 'me') userId = req.user._id
    
    try {
      const shares = await Share.find({ userId })

      logger.info("User accessed shares");
      // setCache(req, next, data);
      return res.status(200).send({ message: "Shares retrieved", data: shares });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    const userId = req.user._id
    
    try {
      const share = new Share({ ...req.body, userId })
      await share.save()

      logger.info("User created a share");
      return res.status(201).send({ message: "Share created", data: share });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    const { id } = req.params;

    try {
      const share = await Share.findByIdAndUpdate(id, req.body, { runValidators: true })
      if(!share) {
        return res.status(404).send({ message: "Share not found" })
      }

      logger.info("User updated share");
      return res.status(201).send({ message: "Share updated" });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    const { id } = req.params;

    try {
      const share = await Share.findByIdAndDelete(id)
      if(!share) {
        return res.status(404).send({ message: "Share not found" })
      }
      
      logger.info("User deleted share");
      return res.status(200).send({ message: "Share deleted" });
    } catch (err) {
      next(err);
    }
  },
};

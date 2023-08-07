import logger from "../utils/logger.js";
import setCache from "../utils/setCache.js";
import Share from "../models/share.model.js";
import userPostService from "../services/userPost.service.js";

export default {
  list: async (req, res, next) => {
    const { userId } = req.params;
    try {
      const shares = await userPostService.getSharedPostsByUser(userId);
      setCache(req, shares);
      return res.status(200).send({ message: "Shares retrieved", data: shares });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    const userId = req.user._id;
    const { postId, content } = req.body;
    try {
      const share = await userPostService.sharePost(userId, postId, content);
      return res.status(201).send({ message: "Share created", data: share });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    const { id } = req.params;
    const { content } = req.body;
    try {
      const share = await userPostService.updateSharedPost(id, content);
      return res.status(201).send({ message: "Share updated", data: share });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    const { id } = req.params;
    try {
      const share = await userPostService.deleteSharedPost(id);
      return res.status(200).send({ message: "Share deleted", data: share });
    } catch (err) {
      next(err);
    }
  },
};

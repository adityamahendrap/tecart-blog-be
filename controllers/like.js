import setCache from "../utils/setCache.js";
import Like from "../models/like.js";
import userPostService from '../services/userPostService.js';

export default {
  list: async (req, res, next) => {
    const { postId } = req.params;
    try {
      const likes = await Like.find({ postId });
      const total = likes.length;
      setCache(req, data)
      return res.status(200).send({ message: "Likes retrieved", total, data: likes });
    } catch (err) {
      next(err);
    }
  },

  count: async (req, res, next) => {
    const { postId } = req.params;
    try {
      const count = await userPostService.getTotalLikesInPost(postId);
      setCache(req, data)
      return res.status(200).send({ message: "Total likes retrieved", data: count });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    const userId = req.user._id;
    const { postId } = req.params;
    try {
      const like = await userPostService.like(userId, postId);
      return res.status(201).send({ message: "Like created", data: like });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    const { id } = req.params;
    try {
      const deleted = await userPostService.unlikePost(id)
      return res.status(200).send({ message: "Like deleted", data: deleted });
    } catch (err) {
      next(err);
    }
  },
};

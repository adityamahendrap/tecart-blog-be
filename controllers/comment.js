import logger from "../utils/logger.js";
import setCache from "../utils/setCache.js";
import Comment from "../models/comment.js";
import userPostService from '../services/userPostService.js';

export default {
  list: async (req, res, next) => {
    const { postId } = req.params;
    try {
      const comments = await Comment.find({ postId }).sort({ createdAt: 1 });

      logger.info("User accessed comments");
      setCache(req, comments)
      return res.status(200).send({ message: "Comments retrieved", data: comments });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    const userId = req.user._id;
    try {
      const comment = await userPostService.createComment(userId, req.body)
      return res.status(201).send({ message: "Comment created", data: comment });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    const { id } = req.params;
    try {
      const comment = await userPostService.updateComment(id, req.body)      
      return res.status(201).send({ message: "Comment updated", data: comment });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    const { id } = req.params;
    try {
      const comment = await userPostService.deleteComment(id)
      return res.status(200).send({ message: "Comment deleted", data: comment });
    } catch (err) {
      next(err);
    }
  },
};

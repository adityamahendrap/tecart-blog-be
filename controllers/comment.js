import logger from "../utils/logger.js";
import setCache from "../utils/setCache.js";
import Comment from '../models/comment.js';

export default {
  list: async (req, res, next) => {
    const { limit, skip } = req.query;
    const { postId } = req.params
    
    try {
      const comments = await Comment.find({ postId }).sort({ createdAt: 1 })

      logger.info("User accessed comments");
      // setCache(req, next, data)
      return res.status(200).send({ message: "Comments retrieved", data: comments });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    const userId = req.user._id

    try {
      const comment = new Comment({ ...req.body, userId })
      await comment.save()

      logger.info("User created a comment");
      return res.status(201).send({ message: "Comment created" });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    const { id } = req.params;

    try {
      const comment = await Comment.findByIdAndUpdate(id, req.body, { runValidators: true })
      if(!comment) {
        return res.status(404).send({ message: "Comment not found" })
      }

      logger.info("User updated comment");
      return res.status(201).send({ message: "Comment updated" });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    const { id } = req.params;

    try {
      const comment = await Comment.findByIdAndDelete(id)
      if(!comment) {
        return res.status(404).send({ message: "Comment not found" })
      }

      logger.info("User deleted comment");
      return res.status(200).send({ message: "Comment deleted" });
    } catch (err) {
      next(err);
    }
  },
};

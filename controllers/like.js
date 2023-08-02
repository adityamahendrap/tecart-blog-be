import logger from "../utils/logger.js";
import setCache from "../utils/setCache.js";
import Like from '../models/like.js';

export default {
  list: async (req, res, next) => {
    const { limit, skip } = req.query;
    const { postId } = req.params
    
    try {
      const likes = await Like.find({ postId })
      const total = likes.length

      logger.info("User accessed likes");
      // setCache(req, next, data)
      return res.status(200).send({ message: "Likes retrieved", total, data: likes });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    const userId = req.user._id

    try {
      const isLiked = await Like.findOne({ ...req.body, userId })
      if(isLiked) {
        return res.status(400).send({ message: "Post has been liked" })
      }

      const like = new Like({ ...req.body, userId })
      await like.save()

      logger.info("User created a like");
      return res.status(201).send({ message: "Like created", data: like });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    const { id } = req.params;

    try {
      const like = await Like.findByIdAndDelete(id)
      if(!like) {
        return res.status(404).send({ message: "Like not found" })
      }
      
      logger.info("User deleted like");
      return res.status(200).send({ message: "Like deleted" });
    } catch (err) {
      next(err);
    }
  },
};

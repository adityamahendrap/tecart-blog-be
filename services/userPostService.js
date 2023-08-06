import logger from "../utils/logger.js";
import setCache from "../utils/setCache.js";
import Post from "../models/post.js";
import ResponseError from "../utils/responseError.js";
import calculatePagination from '../utils/calculatePagination.js';
import userService from './userService.js';
import User from "../models/user.js";
import Follow from "../models/follow.js";
import Like from "../models/like.js";
import Share from "../models/share.js";

const userPostService = {
  getTotalLikesInPost: async (postId) => {
    try {
      const count = await Like.countDocuments({ postId });
      return count
    } catch (err) {
      throw err
    }
  },

  likePost: async (userId, postId) => {
    try {
      const isLiked = await Like.findOne({ postId, userId });
      if (isLiked) {
        throw new ResponseError(400, "Post has been liked");
      }

      const like = new Like({ postId, userId });
      await like.save();
  
      return like
    } catch (err) {
      throw err
    }
  },

  unlikePost: async (likeId) => {
    try {
      const isLiked = await Like.findByIdAndDelete(likeId);
      if (!isLiked) {
        return res.status(404).send({ message: "Like not found" });
      }

      return isLiked
    } catch (err) {
      throw err
    }
  },

  sharePost: async (userId, postId, content) => {
    try {
      const share = new Share({ postId, userId, content });
      await share.save();
      return share
    } catch (err) {
      throw err
    }
  },

  getSharedPostsByUser: async (userId) => {
    try {
      const posts = await Share.aggregate([
        {
          $match: { userId: mongoose.Types.ObjectId(userId) },
        },
        {
          $lookup: {
            from: 'posts',
            localField: 'postId',
            foreignField: '_id',
            as: 'post',
          },
        },
        {
          $unwind: '$post',
        },
      ]);
      
      return posts
    } catch (err) {
      throw err
    }
  },

  updateSharedPost: async (shareId, content) => {
    try {
      const updated = await Share.findByIdAndUpdate(id, req.body, { runValidators: true,});
      if (!updated) {
        throw ResponseError(404, "Share not found");
      }
      return updated
    } catch (err) {
      throw err
    }
  },

  deleteSharedPost: async (shareId) => {
    try {
      const deleted = await Share.findByIdAndDelete(shareId)
      if (!updated) {
        throw ResponseError(404, "Share not found");
      }
      return deleted
    } catch (err) {
      throw err
    }
  }
}

export default userPostService;
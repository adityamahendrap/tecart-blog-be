import setCache from "../utils/setCache.js";
import userPostService from "../services/userPost.service.js";
import notificationService from "../services/notification.service.js";
import userService from "../services/user.service.js";
import postService from "../services/post.service.js";

export default {
  listLikedPosts: async (req, res, next) => {
    const userId = req.user._id
    try {
      const likes = await userPostService.getlikedPosts(userId)
      const total = likes.length
      setCache(req, likes);
      return res.status(200).send({ message: "Liked posts retrieved", total, data: likes });
    } catch (err) {
      next(err);
    }
  },

  count: async (req, res, next) => {
    const { postId } = req.params;
    try {
      const count = await userPostService.getTotalLikesInPost(postId);
      setCache(req, count);
      return res.status(200).send({ message: "Total likes retrieved", data: count });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    const userId = req.user._id;
    const { postId } = req.params;
    try {
      const like = await userPostService.likePost(userId, postId);
      res.status(201).send({ message: "Like created", data: like });

      const post = await postService.getPostById(postId)
      await notificationService.createNotification(post.userId, 'Like', { 
        postId, 
        doerId: userId,
      })
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    const { id } = req.params;
    try {
      const deleted = await userPostService.unlikePost(id);
      return res.status(200).send({ message: "Like deleted", data: deleted });
    } catch (err) {
      next(err);
    }
  },
};

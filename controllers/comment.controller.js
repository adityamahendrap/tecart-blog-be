import setCache from "../utils/setCache.js";
import userPostService from "../services/userPost.service.js";
import notificationService from "../services/notification.service.js";
import postService from "../services/post.service.js";

export default {
  list: async (req, res, next) => {
    const { postId } = req.params;
    try {
      const comments = await userPostService.getCommentsInPost(postId);
      setCache(req, comments);
      return res.status(200).send({ message: "Comments retrieved", data: comments });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    const userId = req.user._id;
    const { postId } = req.params;
    try {
      const comment = await userPostService.createComment(userId, postId, req.body);
      res.status(201).send({ message: "Comment created", data: comment });

      const post = await postService.getPostById(postId)
      await notificationService.createNotification(post.userId, 'Comment', { 
        postId, 
        doerId: userId, 
        commentId: comment._id 
      })
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    const { id } = req.params;
    try {
      const comment = await userPostService.updateComment(id, req.body);
      return res.status(201).send({ message: "Comment updated", data: comment });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    const { id } = req.params;
    try {
      const comment = await userPostService.deleteComment(id);
      return res.status(200).send({ message: "Comment deleted", data: comment });
    } catch (err) {
      next(err);
    }
  },
};

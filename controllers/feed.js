import Post from "../models/post.js";
import User from "../models/user.js";
import Follow from "../models/follow.js";
import Like from "../models/like.js";
import logger from "../utils/logger.js";

export default {
  /*
    Spec:
    - Post dari user yang di follow
    - Related post dari post yang di like
    ? Post berdasarkan category interest user (pemilihan interest di awal saat mendaftar)
  */
  relevant: async (req, res, next) => {
    const { limit, skip } = req.query;
    const userId = req.user._id;

    try {
      // Post dari user yang di follow
      const followings = await Follow.find({ doerId: userId });
      const followingsIds = followings.map((f) => f.targetId);
      const relevantPostsByFollowings = await Post.find({
        userId: { $in: followingsIds },
      });

      // Category yang sama dari post yang di like
      const likedPosts = await Like.find({ userId });
      const likedPostsIds = likedPosts.map((lp) => lp.postId);
      const likedPostsCategoryIds = await Post.distinct("categoryId", {
        _id: { $in: likedPostsIds },
      });
      const relevantPostsByLikedPostsInSameCategory = await Post.find({
        categoryId: { $in: likedPostsCategoryIds },
      });

      // Tags yang sama dari post yang di like
      const likedPostsTags = await Post.distinct("tags", {
        _id: { $in: likedPostsIds },
      });
      const relevantPostsByLikedPostsTags = await Post.find({
        tags: { $in: likedPostsTags },
      });

      logger.info("User accessed relevant posts");
      // setCache(req, data)
      return res.status(200).send({
        message: "Relevant posts retrieved",
        data: [
          ...relevantPostsByFollowings,
          ...relevantPostsByLikedPostsInSameCategory,
          ...relevantPostsByLikedPostsTags,
        ],
      });
    } catch (err) {
      next(err);
    }
  },

  /*
    Spec:
    - Semua post terbaru
  */
  latest: async (req, res, next) => {
    const { limit, skip } = req.query;

    try {
      const posts = await Post.find({}).sort({ createdAt: 1 });

      logger.info("User accessed latest posts");
      // setCache(req, data)
      return res
        .status(200)
        .send({ message: "Latest posts retrieved", data: posts });
    } catch (err) {
      next(err);
    }
  },

  /*
    Spec:
    - Post yang memiliki rata-rata like, comment terbanyak
      Poin:
      - like (1)
      - comment (3)
  */
  top: async (req, res, next) => {
    const { limit, skip } = req.query;

    try {
      const posts = await Post.aggregate([
        {
          $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "postId",
            as: "likes",
          },
        },
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "postId",
            as: "comments",
          },
        },
        {
          $addFields: {
            likeCount: { $size: "$likes" },
            commentCount: { $size: "$comments" },
          },
        },
        {
          $addFields: {
            totalScore: {
              $add: [
                { $multiply: ["$likeCount", 1] },
                { $multiply: ["$commentCount", 3] },
              ],
            },
          },
        },
        {
          $project: {
            comments: 0,
            likes: 0,
          },
        },
        {
          $sort: { totalScore: -1 },
        },
        {
          $limit: 10,
        },
      ]);

      logger.info("User accessed top posts");
      // setCache(req, data)
      return res
        .status(200)
        .send({ message: "Top posts retrieved", data: posts });
    } catch (err) {
      next(err);
    }
  },
};

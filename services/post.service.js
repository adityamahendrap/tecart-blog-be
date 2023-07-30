import Post from "../models/post.js";
import Likes from "../models/likes.js";
import Bookmark from "../models/bookamark.js";
import Comment from "../models/Comment.js";

export default {
  getAllPosts: async () => {
    try {
      return await Post.find();
    } catch (err) {
      throw err;
    }
  },
  
  getOnePost: async (postId) => {
    try {
      return await Post.findById(postId);
    } catch (err) {
      throw err;
    }
  },

  getOnePostDetail: async (postId) => {
    try {
      const post = await Post.findById(postId);
      const postLikesCount = await Likes.countDocuments({ postId });
      const postBookmarksCount = await Bookmark.countDocuments({ postId });
      const postComments = await Comment.find({ postId });
      const postCommentsCount = postComments.length;

      return {
        ...post,
        likesCount: postLikesCount,
        bookmarksCount: postBookmarksCount,
        commentsCount: postCommentsCount,
        comments: postCommentsCount
      }
    } catch (err) {
      throw err;
    }
  },
  
  getUserDraftPosts: async (userId) => {
    try {
      return await Post.find({ userId, status: "Draft" });
    } catch (err) {
      throw err;
    }
  },
  
  getUserPublishedPosts: async (userId) => {
    try {
      return await Post.find({ userId, status: "Published" });
    } catch (err) {
      throw err;
    }
  },

  getRelatedPosts: async (postId) => {
    try {
      const post = await Post.findById(postId);

      const relatedPostsByCategory = await Post.find({
        categoryId: post.categoryId,
        _id: { $ne: post._id },
        userId: { $ne: userId },
      }).limit(2);

      const relatedPostsByTags = await Post.find({
        tags: { $in: post.tags },
        _id: { $ne: post._id },
        userId: { $ne: userId },
      }).limit(2);

      const relatedPostBySameAuthor = await Post.find({
        userId: post.userId,
        _id: { $ne: post._id },
        userId: { $ne: userId },
      }).limit(2);

      return [
        ...relatedPostBySameAuthor,
        ...relatedPostsByCategory,
        ...relatedPostsByTags,
      ]
    } catch (err) {
      throw err;
    }
  },

  getLatestPosts: async (interval) => {
    try {
      return await Post.find().sort({ createdAt: -1 })
    } catch (err) {
      throw err;
    }
  },

  /*
    Spec:
    - Post yang memiliki rata-rata like, comment terbanyak
      Poin:
      - like (1)
      - comment (3)
  */
  getTopPosts: async () => {
    try {
      return await Post.aggregate([
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
            totalScore: { $add: [{ $multiply: ["$likeCount", 1] }, { $multiply: ["$commentCount", 3] }] },
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
    } catch (err) {
      throw err;
    }
  },

  /*
    Spec:
    - Post dari user yang di follow
    - Related post dari post yang di like
    ? Post berdasarkan category interest user (pemilihan interest di awal saat mendaftar)
  */
  getRelevancePost: async (userId) => {
    try {
      // Post dari user yang di follow
      const followings = await Follow.find({ doerId: userId });
      const followingsIds = followings.map(f => f.targetId);
      const relevantPostsByFollowings = await Post.find({ userId: { $in: followingsIds } });
  
      // Category yang sama dari post yang di like
      const likedPosts = await Like.find({ userId });
      const likedPostsIds = likedPosts.map(lp => lp.postId);
      const likedPostsCategoryIds = await Post.distinct("categoryId", { _id: { $in: likedPostsIds } });
      const relevantPostsByLikedPostsInSameCategory = await Post.find({ categoryId: { $in: likedPostsCategoryIds } });
  
      // Tags yang sama dari post yang di like
      const likedPostsTags = await Post.distinct("tags", { _id: { $in: likedPostsIds } });
      const relevantPostsByLikedPostsTags = await Post.find({ tags: { $in: likedPostsTags } });

      return [
        ...relevantPostsByFollowings,
        ...relevantPostsByLikedPostsInSameCategory,
        ...relevantPostsByLikedPostsTags
      ]
    } catch (err) {
      throw err;
    }
  },

  incrementPostViews: async (postId) => {
    try {
      return Post.findByIdAndUpdate(postId);
    } catch (err) {
      throw err;
    }
  },

  createPost: async (data) => {
    try {
      const post = new Post(data);
      await post.save();
      return post;
    } catch (err) {
      throw err;
    }
  },

  updatePost: async (postId, data) => {
    try {
      return await Post.findByIdAndUpdate(postId, data, {
        runValidators: true,
      });
    } catch (err) {
      throw err;
    }
  },

  deletePost: async (postId) => {
    try {
      return await Post.findByIdAndDelete(postId);
    } catch (err) {
      throw err;
    }
  },
};

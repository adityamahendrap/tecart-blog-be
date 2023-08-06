import logger from "../utils/logger.js";
import setCache from "../utils/setCache.js";
import Post from "../models/post.js";
import Category from "../models/category.js";
import ResponseError from "../utils/responseError.js";
import calculatePagination from '../utils/calculatePagination.js';
import userService from './userService.js';

const postService = {
  getPosts: async (page) => {
    const p = calculatePagination(page)
    try {
      const posts = await Post.find().limit(p.limit).skip(p.skip)

      logger.info('postService.getPosts -> Posts retrieved')
      return posts
    } catch (err) {
      logger.info('ERROR postService.getPosts ->', err)
      throw err
    }
  },

  getPostsWithSortAndFilter: async (page, requestQuery) => {
    const { sort: sortQ, userId, categoryId, tags, status } = requestQuery;
    const p = calculatePagination(page)

    const filter = {}
    if(categoryId) filter.categoryId = categoryId
    if(tags) filter.tags = { $in: tags }
    if(status) filter.status = { $regex: status, $options: 'i' } // published, draft
    if(userId) filter.userId = userId
    
    const sort = {}
    if(sortQ === "az") sort.title = 1
    else if(sortQ === "za") sort.title = -1
    else if(sortQ === "oldest") sort.createdAt = 1
    else if(sortQ === "newest") sort.createdAt = -1

    try {
      const posts = await Post.find(filter).sort(sort).skip(p.skip).limit(p.limit)

      logger.info('postService.getPostsWithSortAndFilter -> Posts retrieved')
      return posts
    } catch (err) {
      logger.info('ERROR postService.getPostsWithSortAndFilter ->', err)
      next(err)
    }
  },

  getPostById: async (postId) => {
    try {
      const post = await Post.findById(postId)
      if(!post) {
        throw new ResponseError(404, `Post with id ${postId} not found`);
      }

      logger.info('postService.getPostById -> Post retrieved')
      return post
    } catch (err) {
      logger.error('ERROR postService.getPostById ->', err)
      throw err
    }
  },

  //base on post
  getRelatedPosts: async (postId, userId) => {
    try {
      const post = await Post.findById(postId);

      const relatedPostsByCategory = await Post.find({
        categoryId: post.categoryId,
        _id: { $ne: post._id },
        userId: { $ne: userId }
      }).limit(2);

      const relatedPostsByTags = await Post.find({
        tags: { $in: post.tags },
        _id: { $ne: post._id },
        userId: { $ne: userId }
      }).limit(2);

      const relatedPostBySameAuthor = await Post.find({
        userId: post.userId,
        _id: { $ne: post._id },
        userId: { $ne: userId }
      }).limit(2);

      logger.info('postService.getRelatedPosts -> Related posts retrieved')
      return [
        ...relatedPostBySameAuthor,
        ...relatedPostsByCategory,
        ...relatedPostsByTags
      ]
    } catch (err) {
      logger.error('ERROR postService.getRelatedPosts ->', err)
      throw err
    }
  },

  // base on user
  getRelevantPosts: async (userId, page) => {
    const p = calculatePagination(page)

    try {
      // Posts dari user yang di follow
      const followings = await Follow.find({ doerId: userId });
      const followingsIds = followings.map((f) => f.targetId);
      const relevantPostsByFollowings = await Post.find({
        userId: { $in: followingsIds },
      });

      // category yang sama dari post yang di like
      const likedPosts = await Like.find({ userId });
      const likedPostsIds = likedPosts.map((lp) => lp.postId);
      const likedPostsCategoryIds = await Post.distinct("categoryId", {
        _id: { $in: likedPostsIds },
      });
      const relevantPostsByLikedPostsInSameCategory = await Post.find({
        categoryId: { $in: likedPostsCategoryIds },
      });

      // tags yang sama dari post yang di like
      const likedPostsTags = await Post.distinct("tags", {
        _id: { $in: likedPostsIds },
      });
      const relevantPostsByLikedPostsTags = await Post.find({
        tags: { $in: likedPostsTags },
      });

      // posts berdasarkan user preference saat ini
      const { preference } = await userService.getUserPreference(userId)
      const relevantPostsByUserPreference = await Post.find({
        $or: [
          { tags: { $in: preference.tags } },
          { categoryId: { $in: preference.categoryIds } }
        ]
      })

      const data = [
        ...relevantPostsByFollowings,
        ...relevantPostsByLikedPostsInSameCategory,
        ...relevantPostsByLikedPostsTags,
        ...relevantPostsByUserPreference
      ]
      
      logger.info('postService.getRelevantPosts -> Relevant posts retrieved')
      setCache(req, data)
      return data
    } catch (err) {
      logger.error('ERROR postService.getRelevantPosts ->', err)
      throw err
    }
  },
  
  getLatestPosts: async (page) => {
    const p = calculatePagination(page)

    try {
      const posts = await Post.find({}).sort({ createdAt: 1 }).skip(p.skip).limit(p.limit)
      
      logger.info('postService.getLatestPosts -> Latest posts retrieved')
      setCache(req, data)
      return posts
    } catch (err) {
      logger.info('ERROR postService.getLatestPosts ->', err)
      throw err
    }
  },

  getTopPosts: async (page) => {
    const p = calculatePagination(page)

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
        }
      ]).skip(p.limit).skip(p.skip)
      
      logger.info('postService.getTopPosts -> Top posts retrieved')
      return posts
    } catch (err) {
      logger.error('ERROR postService.getTopPosts ->', err)
      throw err
    }
  },
  
  getRandomPosts: async (total) => {
    try {
      if(typeof total !== 'number' || total < 1) {
        total = 20
      }

      const posts = await YourModel.aggregate([
        { $sample: { size: total } }
      ]);
      
      logger.info('postService.getRandomPosts -> Random posts retrieved')
      return posts;
    } catch (err) {
      logger.error('ERROR postService.getRandomPosts ->', err)
      throw err;
    }
  },
  
  getTagsInPosts: async () => {
    try {
      const tags = await Post.distinct('tags');
      return tags;
    } catch (err) {
      logger.error('ERROR postService.getTagsInPosts ->', err)
      throw err
    }
  },

  getAllCategories: async (sortRequest) => {
    const sort = {};
    if (sortRequest === "az") sort.name = 1;
    else if (sortRequest === "za") sort.name = -1;

    try {
      const categories = await Category.find({}).sort(sort).skip(p.skip).limit(p.limit)
      return categories
    } catch (err) {
      throw err
    }
  },

  getPopularCategories: async () => {
    try {
      const popularCategories = await Post.aggregate([
        {
          $group: {
            _id: "$categoryId",
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]);
      const categoryIds = popularCategories.map((category) => category._id);  
      const categories = await Category.find({ _id: { $in: categoryIds } });

      return categories;
    } catch (err) {
      throw err
    }
  },

  createPost: async (data) => {
    try {
      const post = new Post(data);
      await post.save();

      logger.info('postService.createPost -> Post created')
      return post
    } catch (err) {
      logger.error('ERROR postService.createPost ->', err)
      throw err
    }
  },

  updatePostById: async (postId, data) => {
    try {
      const post = await Post.findByIdAndUpdate(postId, data, { runValidators: true });

      logger.info('postService.updatePostById -> Post updated')
      return post
    } catch (err) {
      logger.error('ERROR postService.updatePostById ->', err)
      throw err
    }
  },

  deletePostById: async (postId) => {
    try {
      const post = await Post.findByIdAndDelete(postId)
      if(!post) {
        throw new ResponseError(404, `Post with id ${postId} not found`);
      }

      logger.info('postService.deletePostById -> Post deleted')
      return post
    } catch (err) {
      logger.error('ERROR postService.deletePostById ->', err)
      throw err
    }
  },
}

export default postService
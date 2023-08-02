import logger from "../utils/logger.js";
import setCache from "../utils/setCache.js";
import Post from "../models/post.js";
import ResponseError from "../utils/responseError.js";
import calculatePagination from '../utils/calculatePagination.js';

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
    if(userId) filter.userId = userId === 'me' ? req.user._id : userId
    
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

      return [
        ...relatedPostBySameAuthor,
        ...relatedPostsByCategory,
        ...relatedPostsByTags
      ]
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
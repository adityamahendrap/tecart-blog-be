import logger from "../utils/logger.js";
import setCache from "../utils/setCache.js";
import Post from "../models/post.js";
import generateSlug from "../utils/generateSlug.js";
import calculateReadingTime from "../utils/calculateReadingTime.js";
import postService from '../services/postService.js';
import calculatePagination from '../utils/calculatePagination.js';

export default {
  list: async (req, res, next) => {
    const { page, sort: sortQ, userId, categoryId, tags, status } = req.query;
    const p = calculatePagination(page)

    const filter = {}
    if(categoryId) filter.categoryId = categoryId
    if(tags) filter.tags = { $in: tags }
    if(status) filter.status = { $regex: status, $options: 'i' } // published, draft
    if(userId) filter.userId = userId === 'me' ? req.user._id : userId
    
    // az, za, newest, oldest
    const sort = {}
    if(sortQ === "az") sort.title = 1
    else if(sortQ === "za") sort.title = -1
    else if(sortQ === "oldest") sort.createdAt = 1
    else if(sortQ === "newest") sort.createdAt = -1
    
    try {
      const posts = await Post.find(filter).sort(sort).skip(p.skip).limit(p.limit)

      logger.info("postController.list -> Posts retrieved");
      setCache(req, next, posts)
      return res.status(200).send({ message: "Posts retrieved", data: posts });
    } catch (err) {
      logger.info("postController.list ->", err);
      next(err);
    }
  },

  get: async (req, res, next) => {
    const { id } = req.params;

    try {
      const post = await postService.getPostById(id)

      setCache(req, next, post)
      return res.status(200).send({ message: "Post retrieved", data: post });
    } catch (err) {
      next(err);
    }
  },

  related: async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id

    try {
      const relatedPosts = await postService.getRelatedPosts(id, userId)

      return res.status(200).send({ message: "Related posts retrieved", data: relatedPosts });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    const { title, content } = req.body;
    const userId = req.user._id;
    const slug = generateSlug(title);
    const readingTime = calculateReadingTime(content);
    const data = { ...req.body, slug, readingTime, userId }

    try {
      const post = await postService.createPost(data)

      return res.status(201).send({ message: "Post created", data: post });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const slug = generateSlug(title);
    const readingTime = calculateReadingTime(content);
    const data = { ...req.body, slug, readingTime }

    try {
      const post = await postService.updatePostById(id, data);
      
      return res.status(201).send({ message: "Post updated", data: post });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    const { id } = req.params;

    try {
      const post = await postService.deletePostById(id)

      return res.status(200).send({ message: "Post deleted", data: post });
    } catch (err) {
      next(err);
    }
  },
};

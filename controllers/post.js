import logger from "../utils/logger.js";
import pagination from "../utils/pagination.js";
import setCache from "../utils/setCache.js";
import Post from "../models/post.js";
import generateSlug from "../utils/generateSlug.js";
import calculateReadingTime from "../utils/calculateReadingTime.js";
import subscriptionHandler from "../utils/subscriptionHandler.js";

export default {
  list: async (req, res, next) => {
    const { limit, skip, sort: sortQ, userId, categoryId, tags, status } = req.query;
    
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
      const posts = await Post.find(filter).sort(sort);
      const total = posts.length

      logger.info("User accessed posts");
      // setCache(req, next, data)
      return res.status(200).send({ message: "Posts retrieved", total, data: posts });
    } catch (err) {
      next(err);
    }
  },

  get: async (req, res, next) => {
    const { id } = req.params;

    try {
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).send({ message: "Post not found" });
      }

      logger.info("User accessed post");
      // setCache(req, next, post)
      return res.status(200).send({ message: "Post retrieved", data: post });
    } catch (err) {
      next(err);
    }
  },

  related: async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id

    try {
      const post = await Post.findById(id);

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

      return res.status(200).send({
        message: "Related posts retrieved",
        data: [
          ...relatedPostBySameAuthor,
          ...relatedPostsByCategory,
          ...relatedPostsByTags,
        ]
      });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    const { title, content } = req.body;
    const userId = req.user._id;
    const slug = generateSlug(title);
    const readingTime = calculateReadingTime(content);

    try {
      const post = new Post({ ...req.body, slug, readingTime, userId });
      await post.save();

      // if(status === "Published") {
      //   await subscriptionHandler(userId)
      // }

      logger.info("User created a post");
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

    try {
      // const preUpdatedPost = await Post.findById(id)
      // if (!preUpdatedPost) {
      //   return res.status(404).send({ message: "Post not found" });
      // }

      // const updatedPost = await Post.findByIdAndUpdate(id, { ...req.body, slug, readingTime }, { runValidators: true });
      // if(preUpdatedPost.status === "Draft" && updatedPost === "Published") {
      //   await subscriptionHandler(updatedPost.userId)
      // }

      await Post.findByIdAndUpdate(id, { ...req.body, slug, readingTime }, { runValidators: true });

      logger.info("User updated post");
      return res.status(201).send({ message: "Post updated" });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    const { id } = req.params;

    try {
      const post = await Post.findByIdAndDelete(id);
      if (!post) {
        return res.status(404).send({ message: "Post not found" });
      }

      logger.info("User deleted post");
      return res.status(200).send({ message: "Post deleted" });
    } catch (err) {
      next(err);
    }
  },
};

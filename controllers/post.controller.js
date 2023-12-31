import setCache from "../utils/setCache.js";
import generateSlug from "../utils/generateSlug.js";
import calculateReadingTime from "../utils/calculateReadingTime.js";
import postService from "../services/post.service.js";
import userService from "../services/user.service.js";

export default {
  list: async (req, res, next) => {
    const { page } = req.query;
    try {
      const posts = await postService.getPostsWithSortAndFilter(page, req.query);
      setCache(req, posts);
      return res.status(200).send({ message: "Posts retrieved", data: posts });
    } catch (err) {
      next(err);
    }
  },

  get: async (req, res, next) => {
    const { id } = req.params;
    const { _id } = req.user;
    try {
      const post = await postService.getPostById(id);
      setCache(req, post);
      res.status(200).send({ message: "Post retrieved", data: post });

      // growth user preferences when post selected
      await userService.updateUserPreference(_id, post.tags, post.categoryId);
    } catch (err) {
      next(err);
    }
  },

  related: async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id;
    try {
      const relatedPosts = await postService.getRelatedPosts(id, userId);
      return res
        .status(200)
        .send({ message: "Related posts retrieved", data: relatedPosts });
    } catch (err) {
      next(err);
    }
  },

  tags: async (req, res, next) => {
    try {
      const tags = await postService.getTagsInPosts();
      setCache(req, tags);
      return res.status(200).send({ message: "Tags retrieved", data: tags });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    const { title, content } = req.body;
    const userId = req.user._id;
    const slug = generateSlug(title);
    const readingTime = calculateReadingTime(content);
    const data = { ...req.body, slug, readingTime, userId };
    try {
      const post = await postService.createPost(data);
      res.status(201).send({ message: "Post created", data: post });

      // create notification for each subscriber ??
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const slug = generateSlug(title);
    const readingTime = calculateReadingTime(content);
    const data = { ...req.body, slug, readingTime };
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
      const post = await postService.deletePostById(id);
      return res.status(200).send({ message: "Post deleted", data: post });
    } catch (err) {
      next(err);
    }
  },

  increment: async (req, res, next) => {
    const { id } = req.params;
    try {
      const post = await postService.incrementViews(id)
      return res.status(200).send({ message: "Post views incremented", data: post });
    } catch (err) {
      next(err);
    }
  }
};

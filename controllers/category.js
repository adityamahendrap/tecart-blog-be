import setCache from "../utils/setCache.js";
import postService from '../services/postService.js';

export default {
  list: async (req, res, next) => {
    const { sort } = req.query;
    // sort: az, za
    try {
      const categories = await postService.getAllCategories(sort)
      setCache(req, categories)
      return res.status(200).send({ message: "Categories retrieved", data: categories });
    } catch (err) {
      next(err);
    }
  },

  popular: async (req, res, next) => {
    try {
      const categories = await postService.getPopularCategories()
      setCache(req, categories)
      return res.status(200).send({ message: "Popular categories retrieved", data: categories });
    } catch (err) {
      next(err);
    }
  },
};

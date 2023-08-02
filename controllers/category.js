import logger from "../utils/logger.js";
import setCache from "../utils/setCache.js";
import Category from "../models/category.js";
import calculatePagination from '../utils/calculatePagination.js';

export default {
  list: async (req, res, next) => {
    const { page, sort: sortQ } = req.query;
    const p = calculatePagination(page)
    
    // az, za
    const sort = {};
    if (sortQ === "az") sort.name = 1;
    else if (sortQ === "za") sort.name = -1;

    try {
      const categories = await Category.find({}).sort(sort).skip(p.skip).limit(p.limit)

      setCache(req, data)
      return res
        .status(200)
        .send({ message: "Categories retrieved", data: categories });
    } catch (err) {
      next(err);
    }
  },
};

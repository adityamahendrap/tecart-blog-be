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
      return res.status(200).send({ message: "Categories retrieved", data: categories });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const category = new Category(req.body);
      await category.save();

      logger.info("User created a category");
      return res.status(201).send({ message: "Category created" });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    const { id } = req.params;

    try {
      const category = await Category.findByIdAndUpdate(id, req.body, {
        runValidators: true,
      });
      if (!category) {
        return res.status(404).send({ message: "Category not found" });
      }

      logger.info("User updated category");
      return res.status(201).send({ message: "Category updated" });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    const { id } = req.params;

    try {
      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        return res.status(404).send({ message: "Category not found" });
      }

      logger.info("User deleted category");
      return res.status(200).send({ message: "Category deleted" });
    } catch (err) {
      next(err);
    }
  },
};

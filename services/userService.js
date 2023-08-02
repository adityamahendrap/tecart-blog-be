import logger from "../utils/logger.js";
import User from "../models/user.js";
import Post from "../models/post.js";
import Follow from "../models/follow.js";
import ResponseError from "../utils/responseError.js";
import calculatePagination from '../utils/calculatePagination.js';

const userService = {
  getUsers: async (page) => {
    const p = calculatePagination(page)

    try {
      const users = await User.find().skip(p.skip).limit(p.limit)

      logger.info("userService.getUsers -> Users retrieved");
      return users;
    } catch (err) {
      logger.error("ERROR userService.getUsers ->", err);
      throw err;
    }
  },

  getUsersWithSort: async (page, sortBy) => {
    let query, users;
    const p = calculatePagination(page)

    try {
      if (["mostposts", "fewestposts"].includes(sortBy)) {
        query = [
          {
            $group: {
              _id: "$userId",
              count: { $sum: 1 },
            },
          },
          { $sort: { count: sort === "mostposts" ? 1 : -1 } },
        ];
        users = await Post.aggregate(query).skip(p.skip).limit(p.limit)
      }
      else if (["mostfollowers", "fewestfollowers"].includes(sortBy)) {
        query = [
          {
            $group: {
              _id: "$targetId",
              count: { $sum: 1 },
            },
          },
          { $sort: { count: sort === "mostfollowers" ? 1 : -1 } },
        ];
        users = await Follow.aggregate(query).skip(p.skip).limit(p.limit)
      }

      logger.info("userService.getUsersWithSort -> Sorted users retrieved");
      return users
    } catch (err) {
      logger.error("ERROR userService.getUsersWithSort ->", err);
      throw err
    }
  },

  getUserById: async (userId) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ResponseError(404, `User with id ${userId} not found`);
      }

      logger.info("userService.getUserById -> User retrieved");
      return user;
    } catch (err) {
      logger.error("ERROR userService.getUserById ->", err);
      throw err;
    }
  },
  
  getUserPreference: async (userId) => {
    try {
      const preference = await User.findById(userId).select('preference')

      logger.info("userService.getUserPreference -> User preference retrieved");
      return preference
    } catch (err) {
      logger.error("ERROR userService.getUserPreference ->", err);
      throw err;
    }
  },

  setUserPreference: async (userId, tags, categoryIds) => {
    try {
      const result = await User.updateOne(userId, { preference: { tags, categoryIds } }, { runValidators: true });

      logger.info("userService.setUserPreference -> User preference updated");
      return result
    } catch (err) {
      logger.error("ERROR userService.setUserPreference ->", err);
      throw err
    }
  },

  updateUserPreference: async (userId, tags, categoryId) => {
    try {
      const user = await User.findById(userId).select('preference')

      // tambahkan preference baru ke array
      const growthTags = user.preference.tags.concat(tags).filter((tag, index, self) => self.indexOf(tag) === index);
      const growthCategoryIds = [...new Set([...user.preference.categoryIds, categoryId])];

      // lalu limit length preferencenya
      const limitTags = growthTags.slice(-20);
      const limitCategoryIds = growthCategoryIds.slice(-5);
  
      const result = await User.updateOne(userId, {
        preference: {
          tags: limitTags,
          categoryIds: limitCategoryIds,
        },
      }, { runValidators: true });

      logger.info("userService.updateUserPreference -> User preference updated");
      return result
    } catch (err) {
      logger.error("ERROR userService.updateUserPreference ->", err);
      throw err
    }
  },

  updateUserById: async (userId, data) => {
    try {
      const user = await User.findByIdAndUpdate(id, data, {
        runValidators: true,
      });
      if (!user) {
        throw new ResponseError(404, `User with id ${userId} not found`);
      }

      logger.info("userService.updateUserById -> User updated");
      return user;
    } catch (err) {
      logger.error("ERROR userService.updateUserById ->", err);
      throw err;
    }
  },

  deleteUserById: async (userId) => {
    try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        throw new ResponseError(404, `User with id ${userId} not found`);
      }

      logger.info("userService.deleteUserById -> User destroyed");
      return user;
    } catch (err) {
      logger.error("ERROR userService.deleteUserById ->", err);
      throw err;
    }
  },
};

export default userService;

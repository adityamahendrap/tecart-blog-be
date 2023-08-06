import logger from "../utils/logger.js";
import User from "../models/user.js";
import Post from "../models/post.js";
import Follow from "../models/follow.js";
import Subscription from "../models/subscription.js";
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

  countFollows: async (userId) => {
    try {
      const followersCount = await Follow.countDocuments({ targetId: userId });
      const followingsCount = await Follow.countDocuments({ doerId: userId });
      return { followersCount, followingsCount }
    } catch (err) {
      throw err
    }
  },

  getFollowers: async (userId) => {
    try {
      const followers = await Follow.find({ targetId: userId });
      return followers
    } catch (err) {
      throw err
    }
  },

  getFollowings: async (userId) => {
    try {
      const followings = await Follow.find({ doerId: userId });
      return followings
    } catch (err) {
      throw err
    }
  },

  follow: async (doerId, targetId) => {
    try {
      if (doerId === targetId) {
        throw new ResponseError(400, "Self-following is not permitted")
      }
      const isFollowed = await Follow({ targetId, doerId });
      if (isFollowed) {
        throw new ResponseError(400, "User has been followed before" );
      }

      const follow = new Follow({ doerId, targetId });
      await follow.save();

      return follow
    } catch (err) {
      throw err
    }
  },

  unfollow: async (followId) => {
    try {
      const unfollow = await Follow.findByIdAndDelete(followId);
      if (!unfollow) {
        throw new ResponseError(404, "Follow not found");
      }
      return unfollow
    } catch (err) {
      throw err
    }
  },

  getSubscriptionByUser: async (subscriberId, targetId) => {
    try {
      const subscription = await Subscription.findOne({ subscriberId, targetId });
      if (!subscription) {
        throw new ResponseError(404, "Subscription not found");
      }
      
    } catch (err) {
      
    }
  },

  subscribe: async (subscriberId, targetId) => {
    if (subscriberId === targetId) {
      throw new ResponseError(400,  "Self-subscription is not permitted");
    }

    try {
      const subscribe = new Subscription({ doerId, targetId });
      await subscribe.save();

      return subscribe
    } catch (err) {
      throw err
    }
  },

  unsubscribe: async (subscriptionId) => {
    try {
      const unsubscribed = await Subscription.findByIdAndDelete(subscriptionId)
      if (!unsubscribed) {
        throw new ResponseError(404, "Subscription not found");
      }
      return unsubscribed
    } catch (err) {
      throw err
    }
  }
};

export default userService;

import setCache from "../utils/setCache.js";
import userService from "../services/user.service.js";

export default {
  count: async (req, res, next) => {
    const { userId } = req.params;
    try {
      const count = await userService.countFollows(userId);
      setCache(req, count);
      return res.status(200).send({ message: "Follows count retrieved", data: count });
    } catch (err) {
      next(err);
    }
  },

  listFollowers: async (req, res, next) => {
    const { userId } = req.params;
    try {
      const data = await userService.getFollowers(userId);
      setCache(req, data);
      return res.status(200).send({ message: "Followers retrieved", data });
    } catch (err) {
      next(err);
    }
  },

  listFollowings: async (req, res, next) => {
    const { userId } = req.params;
    try {
      const data = await userService.getFollowings(userId);
      setCache(req, data);
      return res.status(200).send({ message: "Followings retrieved", data });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    const doerId = req.user._id;
    const { targetId } = req.params;
    try {
      const follow = await userService.follow(doerId, targetId);
      return res.status(201).send({ message: "Follow created", data: follow });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    const { id } = req.params;
    try {
      const unfollow = await userService.unfollow(id);
      return res.status(200).send({ message: "Follow deleted", data: unfollow });
    } catch (err) {
      next(err);
    }
  },
};

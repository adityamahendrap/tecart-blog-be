import logger from "../utils/logger.js";
import setCache from "../utils/setCache.js";
import Bookmark from "../models/bookamark.js";

export default {
  list: async (req, res, next) => {
    const { limit, skip, userId, postId } = req.query;

    const filter = {};
    if (userId) filter.userId = userId === "me" ? req.user._id : userId;
    if (postId) filter.postId = postId;

    try {
      const bookmarks = await Bookmark.find(filter);
      const total = bookmarks.length;

      logger.info("User accessed bookmarks");
      // setCache(req, data)
      return res
        .status(200)
        .send({ message: "Bookmarks retrieved", total, data: bookmarks });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    const userId = req.user._id;

    try {
      const isBookmarked = await Bookmark.findOne({ ...req.body, userId });
      if (isBookmarked) {
        return res
          .status(400)
          .send({ message: "Post has been bookmarked before" });
      }

      const bookmark = new Bookmark({ ...req.body, userId });
      await bookmark.save();

      logger.info("User created a bookmark");
      return res
        .status(201)
        .send({ message: "Bookmark created", data: bookmark });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    const { id } = req.params;

    try {
      const bookmark = await Bookmark.findByIdAndDelete(id);
      if (!bookmark) {
        return res.status(404).send({ message: "Bookmark not found" });
      }

      logger.info("User deleted bookmark");
      return res.status(200).send({ message: "Bookmark deleted" });
    } catch (err) {
      next(err);
    }
  },
};

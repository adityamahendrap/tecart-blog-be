import postService from "../services/post.service.js";
import setCache from "../utils/setCache.js";

export default {
  /*
    Spec:
    - Post dari user yang di follow
    - Related post dari post yang di like
    ? Post berdasarkan user preference
  */
  relevant: async (req, res, next) => {
    const { page } = req.query;
    const userId = req.user._id;
    try {
      const relevant = await postService.getRelevantPosts(userId, page);
      setCache(req, relevant);
      return res
        .status(200)
        .send({ message: "Relevant posts retrieved", data: relevant });
    } catch (err) {
      next(err);
    }
  },

  /*
    Spec:
    - Semua post terbaru
  */
  latest: async (req, res, next) => {
    const { page } = req.query;
    try {
      const posts = await postService.getLatestPosts(page);
      setCache(req, posts);
      return res
        .status(200)
        .send({ message: "Latest posts retrieved", data: posts });
    } catch (err) {
      next(err);
    }
  },

  /*
    Spec:
    - Post yang memiliki rata-rata like, comment terbanyak
      Poin:
      - like (1)
      - comment (3)
  */
  top: async (req, res, next) => {
    const { page } = req.query;
    try {
      const posts = await postService.getTopPosts(page);
      setCache(req, posts);
      return res
        .status(200)
        .send({ message: "Top posts retrieved", data: posts });
    } catch (err) {
      next(err);
    }
  },

  random: async (req, res, next) => {
    const { total } = req.params;
    try {
      const posts = await postService.getRandomPosts(total);
      return res
        .status(200)
        .send({ message: "Random posts retrieved", data: posts });
    } catch (err) {
      next(err);
    }
  },
};

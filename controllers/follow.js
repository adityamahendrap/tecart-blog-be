import logger from "../utils/logger.js";
import setCache from "../utils/setCache.js";
import Follow from '../models/follow.js';

export default {
  list: async (req, res, next) => {
    let { userId } = req.params
    let { limit, skip, type } = req.query
    
    const filter = {}
    if(type === 'followers') filter.targetId = userId === 'me' ? req.user._id : userId
    if(type === 'followings') filter.doerId = userId === 'me' ? req.user._id : userId
    
    try {
      const follows = await Follow.find(filter)
      const total = follows.length

      logger.info("User accessed follows");
      // setCache(req, next, data)
      return res.status(200).send({ message: "Follows retrieved", total, data: follows });
    } catch (err) {
      next(err)
    }
  },

  create: async (req, res, next) => {
    const doerId = req.user._id
    const { targetId } = req.body
  
    if(doerId === targetId) {
      return res.status(400).send({ message: "Self-following is not permitted" })
    }
    const isFollowed = await Follow({ targetId, doerId })
    if(isFollowed) {
      return res.status(400).send({ message: "User has been followed before" })
    }

    try {
      const follow = new Follow({ ...req.body, doerId })
      await follow.save()

      logger.info("User created a follow");
      return res.status(201).send({ message: "Follow created", data: follow });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    const { id } = req.params;

    try {
      const follow = await Follow.findByIdAndDelete(id)
      if(!follow) {
        return res.status(404).send({ message: "Follow not found" })
      }
      
      logger.info("User deleted follow");
      return res.status(200).send({ message: "Follow deleted" });
    } catch (err) {
      next(err);
    }
  },
};

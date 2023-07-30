import logger from '../utils/logger.js';
import setCache from "../utils/setCache.js";
import pagination from '../utils/pagination.js';
import User from '../models/user.js';
import Post from '../models/post.js';
import Follow from '../models/follow.js';
// import userService from '../services/';

export default {
  list: async (req, res, next) => {
    const { limit, skip, sort: sortQ } = req.query

    // total post, followers
    const sort = {}
    const filter = {}
    // if(sortQ === 'mostposts')
    // if(sortQ === 'fewestposts')
    // if(sortQ === 'mostfollowers')
    // if(sortQ === 'mostfollowers')

    try {
      // const userByPosts = await Post.aggregate([
      //   {
      //     $group: {
      //       _id: "$userId",
      //       count: { $sum: 1 }
      //     }
      //   }
      // ]);
      // const userByFollowers = await Follow.aggregate([
      //   {
      //     $group: {
      //       _id: "$targetId",
      //       count: { $sum: 1 }
      //     }
      //   }
      // ]);
      
      // const users = await userService.getAllUser();
      
      logger.info("User accessed users");
      // setCache(req, next, data)
      return res.status(200).send({ message: "Users retrieved", data: users })
    } catch (err) {
      next(err)
    }
  },

  get: async (req, res, next) => {
    const { id } = req.params
    
    try {
      // const user = await userService.getOneUser(id)
      if(!user) {
        return res.status(404).send('User not found')
      }

      logger.info("User accessed user");
      // setCache(req, next, user)
      return res.status(200).send({ message: "User retrieved", data: user })
    } catch (err) {
      next(err)
    }
  },

  update: async (req, res, next) => {
    const { id } =  req.params

    try {
      const user = await User.findByIdAndUpdate(id, req.body, { runValidators: true })
      if(!user) {
        return res.status(404).send({ message: 'User not found' })
      }

      logger.info("User updated user");
      return res.status(201).send({ message: "User updated" })
    } catch (err) {
      next(err)
    }
  },

  delete: async (req, res, next) => {
    const { id } =  req.params

    try {
      const user = await User.findByIdAndDelete(id)
      if(!user) {
        return res.status(404).send({ message: 'User not found' })
      }

      logger.info("User deleted user");
      return res.status(200).send({ message: "User deleted" })
    } catch (err) {
      next(err)
    }
  },
}

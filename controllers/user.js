import logger from '../utils/logger.js';
import setCache from "../utils/setCache.js";
import userService from '../services/userService.js';

export default {
  list: async (req, res, next) => {
    const { sort, page } = req.query
    const availableSort = ["mostposts", "fewestposts", "mostfollowers", "fewestfollowers"]
    let users

    try {
      if(availableSort.includes(sort)) users = await userService.getUsersWithSort(page, sort)
      else users = await userService.getUsers(page)

      logger.info("User accessed users");
      setCache(req, next, data)
      return res.status(200).send({ message: "Users retrieved", data: users })
    } catch (err) {
      next(err)
    }
  },

  get: async (req, res, next) => {
    const { id } = req.params
    
    try {
      const user = await userService.getUserById(id)

      setCache(req, next, user)
      return res.status(200).send({ message: "User retrieved", data: user })
    } catch (err) {
      next(err)
    }
  },

  update: async (req, res, next) => {
    const { id } =  req.params

    try {
      const user = await userService.updateUserById(id, req.body)

      return res.status(201).send({ message: "User updated", data: user })
    } catch (err) {
      next(err)
    }
  },

  delete: async (req, res, next) => {
    const { id } =  req.params

    try {
      const user = await userService.deleteUserById(id)

      return res.status(200).send({ message: "User deleted", user })
    } catch (err) {
      next(err)
    }
  },
}

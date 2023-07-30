import User from '../models/user.js';

export default {
  getAllUser: async () => {
    try {
      return await User.find();
    } catch (err) {
      throw err;
    }
  },
  
  getOneUser: async (userId) => {
    try {
      return await User.findById(userId);
    } catch (err) {
      throw err;
    }
  },

  createUser: async (data) => {
    try {
      const user = new User(data);
      await user.save();
      return user;
    } catch (err) {
      throw err;
    }
  },

  updateUser: async (userId, data) => {
    try {
      return await User.findByIdAndUpdate(userId, data, { runValidators: true });
    } catch (err) {
      throw err;
    }
  },

  deleteUser: async (userId) => {
    try {
      return await User.findByIdAndDelete(userId)
    } catch (err) {
      throw err;
    }
  }
}
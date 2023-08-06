import authController from "../controllers/auth.controller.js";
import categoryController from "../controllers/category.controller.js";
import commentController from "../controllers/comment.controller.js";
import followController from "../controllers/follow.controller.js";
import likeController from "../controllers/like.controller.js";
import postController from "../controllers/post.controller.js";
import shareController from "../controllers/share.controller.js";
import subscriptionController from "../controllers/subscription.controller.js";
import userController from "../controllers/user.controller.js";
import feedController from "../controllers/feed.controller.js";
import { Router } from "express";
const router = Router();

// sufix SELF mean you dont need to define userId. JWT already handle it
// don't forget to use prefix /api for the path
const path = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  VERIFY_TOKEN: "/auth/verify-token",
  VERIFY_EMAIL: "/auth/verify-email/:id",
  SEND_EMAIL_VERIFICATION: "/auth/send-email-verification",
  RESET_PASSWORD: "/auth/reset-password",
  CHANGE_PASSWORD: "/auth/change-password",
  LOGOUT: "/auth/logout", // ??

  GET_USERS: "/users",
  GET_USER: "/users/:id",
  UPDATE_USER_SELF: "/users",
  DELETE_ACCOUNT_SELF: "/users",
  SET_NEW_USER_PREFERENCE_SELF: "/users/new/preference",

  GET_POSTS: "/posts",
  GET_POST: "/posts/:id",
  GET_RELATED_POSTS: "/posts/:id/related",
  CREATE_POST_SELF: "/posts",
  UPDATE_POST: "/posts/:id",
  DELETE_POST: "/posts/:id",

  GET_RANDOM_POSTS_FOR_FEEDS: "/feeds/random/:total",
  GET_RELEVANT_POSTS_FOR_FEEDS: "/feeds/relevant",
  GET_LATEST_POSTS_FOR_FEEDS: "/feeds/latest",
  GET_TOP_POSTS_FOR_FEEDS: "/feeds/top",

  GET_CATEGORIES: "/categories",
  GET_POPULAR_CATEGORIES: "/categories/popular",
  GET_TAGS: "/tags",

  GET_LIKES_IN_POSTS: "/likes/:postId",
  GET_LIKED_POSTS_BY_USER_SELF: "/likes",
  LIKE_POST_SELF: "/likes/:postId",
  UNLIKE_POST: "/likes/:id",

  GET_COMMENTS_IN_POSTS: "/comments/:postId",
  GET_ROOT_COMMENTS_IN_POSTS: "/comments/:postId",
  GET_REPLY_COMMENTS_IN_POSTS: "/comments/:commentId",
  CREATE_COMMENT_SELF: "/comments",
  UPDATE_COMMENT: "/comments/:id",
  DELETE_COMMENT: "/comments/:id",

  GET_FOLLOWERS: "/follows/followers/:userId",
  GET_FOLLOWINGS: "/follows/followings/:userId",
  FOLLOW_USER_SELF: "/follows/:userId",
  UNFOLLOW_USER_SELF: "/follows/:userId",

  GET_NOTIFICATIONS_SELF: "/notifications",
};

router.post(path.LOGIN, authController.login);
router.post(path.REGISTER, authController.register);
router.post(path.VERIFY_TOKEN, authController.verifyToken);
router.get(path.VERIFY_EMAIL, authController.verifyEmail);
router.get(
  path.SEND_EMAIL_VERIFICATION,
  verifyUser,
  authController.sendEmailVerification
);
router.put(path.CHANGE_PASSWORD, verifyUser, authController.changePassword);
router.put(path.RESET_PASSWORD, authController.resetPassword);

router.get(path.GET_USERS, userController.list);
router.get(path.GET_USER, userController.get);
router.put(
  path.SET_NEW_USER_PREFERENCE_SELF,
  verifyUser,
  userController.update
);
router.put(path.UPDATE_USER_SELF, verifyUser, userController.update);
router.delete(path.DELETE_ACCOUNT_SELF, verifyUser, userController.delete);

router.get(path.GET_POSTS, verifyUser, postController.list);
router.get(path.GET_POST, verifyUser, postController.get);
router.get(path.GET_RELATED_POSTS, verifyUser, postController.related);
router.post(path.CREATE_POST_SELF, verifyUser, postController.create);
router.put(path.UPDATE_POST, verifyUser, postController.update);
router.delete(path.DELETE_POST, verifyUser, postController.delete);

router.get(path.GET_RANDOM_POSTS_FOR_FEEDS, verifyUser, feedController.random);
router.get(
  path.GET_RELEVANT_POSTS_FOR_FEEDS,
  verifyUser,
  feedController.relevant
);
router.get(path.GET_LATEST_POSTS_FOR_FEEDS, verifyUser, feedController.latest);
router.get(path.GET_TOP_POSTS_FOR_FEEDS, verifyUser, feedController.top);

router.get(path.GET_CATEGORIES, categoryController.list);
router.get(path.GET_POPULAR_CATEGORIES, categoryController.popular);

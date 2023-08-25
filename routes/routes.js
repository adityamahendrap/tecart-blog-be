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
import cacheMiddleware from '../middlewares/cacheMiddleware.js';
import verifyUser from '../middlewares/verifyUserMiddleware.js';
import authRestriction from '../middlewares/authRestrictionMiddleware.js';
import express, { Router } from "express";
const app = express();
const router = Router();

// sufix SELF mean you dont need to define userId. JWT already handle it
// don't forget to use prefix /api for the path
const path = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  VERIFY_TOKEN: "/auth/verify-token",
  VERIFY_EMAIL: "/auth/verify-email/:id",
  SEND_EMAIL_VERIFICATION: "/auth/send-email-verification",
  SEND_EMAIL_RESET_PASSWORD: "/auth/send-email-reset-password",
  RESET_PASSWORD: "/auth/reset-password",
  CHANGE_PASSWORD: "/auth/change-password", 
  LOGOUT: "/auth/logout", // ??
  GITHUB_OAUTH: "/sessions/oauth/github",
  TEST_GITHUB_OAUTH: "/auth/github/test",
  GOOGLE_OAUTH: "/auth/google",

  ME: "/me",
  GET_USERS: "/users",
  GET_USER: "/users/:id",
  UPDATE_USER_SELF: "/users/me",
  DELETE_ACCOUNT_SELF: "/users/me",
  SET_NEW_USER_PREFERENCE_SELF: "/users/me/preference/new",

  GET_POSTS: "/posts",
  GET_POST: "/posts/:id",
  GET_RELATED_POSTS: "/posts/:id/related",
  CREATE_POST_SELF: "/posts",
  UPDATE_POST: "/posts/:id",
  DELETE_POST: "/posts/:id",
  INCREMENT_VIEWS: "/posts/:id/views-plus-plus",

  GET_RANDOM_POSTS_FOR_FEEDS: "/feeds/random/:total",
  GET_RELEVANT_POSTS_FOR_FEEDS: "/feeds/relevant",
  GET_LATEST_POSTS_FOR_FEEDS: "/feeds/latest",
  GET_TOP_POSTS_FOR_FEEDS: "/feeds/top",

  GET_CATEGORIES: "/categories",
  GET_POPULAR_CATEGORIES: "/categories/popular",
  GET_TAGS: "/tags",

  GET_LIKES_COUNT_IN_POST: "/likes/:postId",
  GET_LIKED_POSTS_BY_USER_SELF: "/likes",
  LIKE_POST_SELF: "/likes/:postId",
  UNLIKE_POST: "/likes/:id",

  GET_COMMENTS_IN_POSTS: "/comments/:postId",
  GET_ROOT_COMMENTS_IN_POSTS: "/comments/:postId", // ??
  GET_REPLY_COMMENTS_IN_POSTS: "/comments/:commentId", // ??
  CREATE_COMMENT_SELF: "/comments/:postId",
  UPDATE_COMMENT: "/comments/:id",
  DELETE_COMMENT: "/comments/:id",

  COUNT_FOLLOWS: "/follows/:userId/total",
  GET_FOLLOWERS: "/follows/followers/:userId",
  GET_FOLLOWINGS: "/follows/followings/:userId",
  FOLLOW_USER_SELF: "/follows/:targetId",
  UNFOLLOW_USER_SELF: "/follows/:id",

  GET_SHARED_POSTS: "/shares/:userId",
  SHARE_POST: "/shares",
  UPDATE_SHARED_POST: "/shares/:id",
  DELETE_SHARED_POST: "/shares/:id",

  GET_NOTIFICATIONS_SELF: "/notifications",
  CREATE_NOTIFICATION: "/notifications/:userId", // ??

  GET_SUBSCRIPTION: "/subscriptions/:targetId",
  CREATE_SUBSCRIPTION_SELF: "/subscriptions/:targetId",
  DELETE_SUBSCRIPTION: "/subscriptions/:id",
};

router.post(path.LOGIN, authController.login);
router.post(path.REGISTER, authController.register);
router.post(path.VERIFY_TOKEN, authController.verifyToken);
router.get(path.VERIFY_EMAIL, authController.verifyEmail);
router.get(path.SEND_EMAIL_VERIFICATION, verifyUser, authRestriction, authController.sendEmailVerification);
router.put(path.CHANGE_PASSWORD, verifyUser, authRestriction, authController.changePassword);
router.put(path.RESET_PASSWORD, authController.resetPassword);
router.get(path.GITHUB_OAUTH, authController.githubOauth);

app.use(cacheMiddleware)

router.get(path.GET_USERS, userController.list);
router.get(path.ME, verifyUser, userController.me);
router.get(path.GET_USER, userController.get);
router.put(path.SET_NEW_USER_PREFERENCE_SELF, verifyUser, userController.setPreference);
router.put(path.UPDATE_USER_SELF, verifyUser, userController.update);
router.delete(path.DELETE_ACCOUNT_SELF, verifyUser, userController.delete);

router.get(path.GET_POSTS, postController.list);
router.get(path.GET_POST, postController.get);
router.get(path.GET_RELATED_POSTS, verifyUser, postController.related);
router.post(path.CREATE_POST_SELF, verifyUser, postController.create);
router.put(path.UPDATE_POST, verifyUser, postController.update);
router.delete(path.DELETE_POST, verifyUser, postController.delete);
router.put(path.INCREMENT_VIEWS, postController.increment);

router.get(path.GET_RANDOM_POSTS_FOR_FEEDS, feedController.random);
router.get(path.GET_RELEVANT_POSTS_FOR_FEEDS, verifyUser, feedController.relevant);
router.get(path.GET_LATEST_POSTS_FOR_FEEDS, feedController.latest);
router.get(path.GET_TOP_POSTS_FOR_FEEDS, feedController.top);

router.get(path.GET_CATEGORIES, categoryController.list);
router.get(path.GET_POPULAR_CATEGORIES, categoryController.popular);
router.get(path.GET_TAGS, postController.tags);

router.get(path.GET_LIKES_COUNT_IN_POST, likeController.count)
router.get(path.GET_LIKED_POSTS_BY_USER_SELF, likeController.listLikedPosts)
router.post(path.LIKE_POST_SELF, verifyUser, likeController.create)
router.delete(path.UNLIKE_POST, verifyUser, likeController.delete)

router.get(path.GET_COMMENTS_IN_POSTS, commentController.list)
router.post(path.CREATE_COMMENT_SELF, verifyUser, commentController.create)
router.put(path.UPDATE_COMMENT, verifyUser, commentController.update)
router.delete(path.DELETE_COMMENT, verifyUser, commentController.delete)

router.get(path.COUNT_FOLLOWS, followController.count)
router.get(path.GET_FOLLOWERS, followController.listFollowers)
router.get(path.GET_FOLLOWINGS, followController.listFollowings)
router.post(path.FOLLOW_USER_SELF, verifyUser, followController.create)
router.delete(path.UNFOLLOW_USER_SELF, verifyUser, followController.delete)

router.get(path.GET_SHARED_POSTS, shareController.list)
router.post(path.SHARE_POST, verifyUser, shareController.create)
router.put(path.UPDATE_SHARED_POST, verifyUser, shareController.update)
router.delete(path.DELETE_SHARED_POST, verifyUser, shareController.delete)

// router.get(path.GET_NOTIFICATIONS_SELF, verifyUser)

router.get(path.GET_SUBSCRIPTION, subscriptionController.get)
router.post(path.CREATE_SUBSCRIPTION_SELF, verifyUser, subscriptionController.create)
router.delete(path.DELETE_SUBSCRIPTION, verifyUser, subscriptionController.delete)

export default router
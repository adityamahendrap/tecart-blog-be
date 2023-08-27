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
import path from './path.js';
import express, { Router } from "express";
const app = express();
const router = Router();

router.post(path.LOGIN, authController.login);
router.post(path.REGISTER, authController.register);
router.post(path.VERIFY_TOKEN, authController.verifyToken);
router.get(path.VERIFY_EMAIL, authController.verifyEmail);
router.get(path.RESEND_EMAIL_VERIFICATION, verifyUser, authRestriction, authController.resendEmailVerification);
router.put(path.CHANGE_PASSWORD, verifyUser, authRestriction, authController.changePassword);
router.put(path.RESET_PASSWORD, authController.resetPassword);
router.get(path.GITHUB_OAUTH, authController.githubOauth);
router.get(path.GOOGLE_OAUTH, authController.googleOauth);
router.get(path.FACEBOOK_OAUTH, authController.facebookOauth);

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
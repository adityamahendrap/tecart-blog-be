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

router[path.LOGIN.method](path.LOGIN.route, authController.login);

router[path.REGISTER.method](path.REGISTER.route, authController.register);

router[path.VERIFY_TOKEN.method](path.VERIFY_TOKEN.route, authController.verifyToken);

router[path.VERIFY_EMAIL.method](path.VERIFY_EMAIL.route, authController.verifyEmail);

router[path.RESEND_EMAIL_VERIFICATION.method](path.RESEND_EMAIL_VERIFICATION.route, verifyUser, authRestriction, authController.resendEmailVerification);

router[path.CHANGE_PASSWORD.method](path.CHANGE_PASSWORD.route, verifyUser, authRestriction, authController.changePassword);

router[path.RESET_PASSWORD.method](path.RESET_PASSWORD.route, authController.resetPassword);

router[path.GITHUB_OAUTH.method](path.GITHUB_OAUTH.route, authController.githubOauth);

router[path.GOOGLE_OAUTH.method](path.GOOGLE_OAUTH.route, authController.googleOauth);

router[path.FACEBOOK_OAUTH.method](path.FACEBOOK_OAUTH.route, authController.facebookOauth);

app.use(cacheMiddleware)

router[path.GET_USERS.method](path.GET_USERS.route, userController.list);

router[path.ME.method](path.ME.route, verifyUser, userController.me);

router[path.GET_USER.method](path.GET_USER.route, userController.get);

router[path.SET_NEW_USER_PREFERENCE_SELF.method](path.SET_NEW_USER_PREFERENCE_SELF.route, verifyUser, userController.setPreference);

router[path.UPDATE_USER_SELF.method](path.UPDATE_USER_SELF.route, verifyUser, userController.update);

router[path.DELETE_ACCOUNT_SELF.method](path.DELETE_ACCOUNT_SELF.route, verifyUser, userController.delete);

router[path.GET_POSTS.method](path.GET_POSTS.route, postController.list);

router[path.GET_POST.method](path.GET_POST.route, postController.get);

router[path.GET_RELATED_POSTS.method](path.GET_RELATED_POSTS.route, verifyUser, postController.related);

router[path.CREATE_POST_SELF.method](path.CREATE_POST_SELF.route, verifyUser, postController.create);

router[path.UPDATE_POST.method](path.UPDATE_POST.route, verifyUser, postController.update);

router[path.DELETE_POST.method](path.DELETE_POST.route, verifyUser, postController.delete);

router[path.INCREMENT_VIEWS.method](path.INCREMENT_VIEWS.route, postController.increment);

router[path.GET_RANDOM_POSTS_FOR_FEEDS.method](path.GET_RANDOM_POSTS_FOR_FEEDS.route, feedController.random);

router[path.GET_RELEVANT_POSTS_FOR_FEEDS.method](path.GET_RELEVANT_POSTS_FOR_FEEDS.route, verifyUser, feedController.relevant);

router[path.GET_LATEST_POSTS_FOR_FEEDS.method](path.GET_LATEST_POSTS_FOR_FEEDS.route, feedController.latest);

router[path.GET_TOP_POSTS_FOR_FEEDS.method](path.GET_TOP_POSTS_FOR_FEEDS.route, feedController.top);

router[path.GET_CATEGORIES.method](path.GET_CATEGORIES.route, categoryController.list);

router[path.GET_POPULAR_CATEGORIES.method](path.GET_POPULAR_CATEGORIES.route, categoryController.popular);

router[path.GET_TAGS.method](path.GET_TAGS.route, postController.tags);

router[path.GET_LIKES_COUNT_IN_POST.method](path.GET_LIKES_COUNT_IN_POST.route, likeController.count)

router[path.GET_LIKED_POSTS_BY_USER_SELF.method](path.GET_LIKED_POSTS_BY_USER_SELF.route, likeController.listLikedPosts)

router[path.LIKE_POST_SELF.method](path.LIKE_POST_SELF.route, verifyUser, likeController.create)

router[path.UNLIKE_POST.method](path.UNLIKE_POST.route, verifyUser, likeController.delete)

router[path.GET_COMMENTS_IN_POSTS.method](path.GET_COMMENTS_IN_POSTS.route, commentController.list)

router[path.CREATE_COMMENT_SELF.method](path.CREATE_COMMENT_SELF.route, verifyUser, commentController.create)

router[path.UPDATE_COMMENT.method](path.UPDATE_COMMENT.route, verifyUser, commentController.update)

router[path.DELETE_COMMENT.method](path.DELETE_COMMENT.route, verifyUser, commentController.delete)

router[path.COUNT_FOLLOWS.method](path.COUNT_FOLLOWS.route, followController.count)

router[path.GET_FOLLOWERS.method](path.GET_FOLLOWERS.route, followController.listFollowers)

router[path.GET_FOLLOWINGS.method](path.GET_FOLLOWINGS.route, followController.listFollowings)

router[path.FOLLOW_USER_SELF.method](path.FOLLOW_USER_SELF.route, verifyUser, followController.create)

router[path.UNFOLLOW_USER_SELF.method](path.UNFOLLOW_USER_SELF.route, verifyUser, followController.delete)

router[path.GET_SHARED_POSTS.method](path.GET_SHARED_POSTS.route, shareController.list)

router[path.SHARE_POST.method](path.SHARE_POST.route, verifyUser, shareController.create)

router[path.UPDATE_SHARED_POST.method](path.UPDATE_SHARED_POST.route, verifyUser, shareController.update)

router[path.DELETE_SHARED_POST.method](path.DELETE_SHARED_POST.route, verifyUser, shareController.delete)

// router[path.GET_NOTIFICATIONS_SELF.method](path.GET_NOTIFICATIONS_SELF.route, verifyUser)

router[path.GET_SUBSCRIPTION.method](path.GET_SUBSCRIPTION.route, subscriptionController.get)

router[path.CREATE_SUBSCRIPTION_SELF.method](path.CREATE_SUBSCRIPTION_SELF.route, verifyUser, subscriptionController.create)

router[path.DELETE_SUBSCRIPTION.method](path.DELETE_SUBSCRIPTION.route, verifyUser, subscriptionController.delete)


export default router
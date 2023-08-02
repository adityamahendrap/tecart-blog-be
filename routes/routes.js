import { Router } from "express";
const router = Router();

// sufix SELF mean you dont need to define userId. JWT already handle it
const PATH = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  VERIFY_TOKEN: "/auth/verify-token",
  VERIFY_EMAIL: "/auth/verify-email/:id",
  SEND_EMAIL_VERIFICATION: "/auth/send-email-verification",
  RESET_PASSWORD: "/auth/reset-password",
  CHANGE_PASSWORD: "/auth/change-password",

  GET_USERS: "/users",
  GET_USER: "/users/:id",
  UPDATE_USER_SELF: "/users",
  DELETE_USER_SELF: "/users",
  SET_NEW_USER_PREFERENCE_SELF: "/users/new/preference",

  GET_POSTS: "/posts",
  GET_POST: "/posts/:id",
  GET_RELATED_POSTS: "/posts/:id/related",
  CREATE_POST_SELF: "/posts",
  UPDATE_POST: "/posts/:id",
  DELETE_POST: "/posts/:id",
  
  GET_RELEVANT_POSTS_FOR_FEEDS: "/feeds/relevant",
  GET_LATEST_POSTS_FOR_FEEDS: "/feeds/latest",
  GET_TOP_POSTS_FOR_FEEDS: "/feeds/top",

  GET_CATEGORIES: "/categories",
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
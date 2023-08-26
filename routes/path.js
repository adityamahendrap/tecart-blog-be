// sufix SELF mean you dont need to define userId. JWT already handle it
// don't forget to use prefix /api for the path
export default {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  VERIFY_TOKEN: "/auth/verify-token",
  VERIFY_EMAIL: "/auth/verify-email/:id",
  RESEND_EMAIL_VERIFICATION: "/auth/send-email-verification",
  SEND_EMAIL_RESET_PASSWORD: "/auth/send-email-reset-password",
  RESET_PASSWORD: "/auth/reset-password",
  CHANGE_PASSWORD: "/auth/change-password", 
  LOGOUT: "/auth/logout", // ??
  // GITHUB_OAUTH: "/oauth/github",
  // GOOGLE_OAUTH: "/oauth/google",
  GITHUB_OAUTH: "/sessions/oauth/github",
  GOOGLE_OAUTH: "/sessions/oauth/google",

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

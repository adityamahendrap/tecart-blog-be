// sufix SELF mean you dont need to define userId. JWT already handle it
// don't forget to use prefix /api for the path
export default {
  LOGIN: {
    method: "post",
    route: "/auth/login",
    description: ""
  },
  REGISTER: {
    method: "post",
    route: "/auth/register",
    description: ""
  },
  VERIFY_TOKEN: {
    method: "post",
    route: "/auth/verify-token",
    description: ""
  },
  VERIFY_EMAIL: {
    method: "get",
    route: "/auth/verify-email/:id",
    description: ""
  },
  RESEND_EMAIL_VERIFICATION: {
    method: "get",
    route: "/auth/send-email-verification",
    description: ""
  },
  SEND_EMAIL_RESET_PASSWORD: {
    method: "get",
    route: "/auth/send-email-reset-password",
    description: ""
  },
  RESET_PASSWORD: {
    method: "put",
    route: "/auth/reset-password",
    description: ""
  },
  CHANGE_PASSWORD: {
    method: "put",
    route: "/auth/change-password",
    description: ""
  }, 
  LOGOUT: { // ??
    method: "get",
    route: "/auth/logout",
    description: ""
  },
  GITHUB_OAUTH: {
    method: "get",
    route: "/oauth/github",
    description: ""
  },
  GOOGLE_OAUTH: {
    method: "get",
    route: "/oauth/google",
    description: ""
  },
  FACEBOOK_OAUTH: {
    method: "get",
    route: "/oauth/facebook",
    description: ""
  },
  ME: {
    method: "get",
    route: "/me",
    description: ""
  },
  GET_USERS: {
    method: "get",
    route: "/users",
    description: ""
  },
  GET_USER: {
    method: "get",
    route: "/users/:id",
    description: ""
  },
  UPDATE_USER_SELF: {
    method: "put",
    route: "/users/me",
    description: ""
  },
  DELETE_ACCOUNT_SELF: {
    method: "delete",
    route: "/users/me",
    description: ""
  },
  SET_NEW_USER_PREFERENCE_SELF: {
    method: "put",
    route: "/users/me/preference/new",
    description: ""
  },
  GET_POSTS: {
    method: "get",
    route: "/posts",
    description: ""
  },
  GET_POST: {
    method: "get",
    route: "/posts/:id",
    description: ""
  },
  GET_RELATED_POSTS: {
    method: "get",
    route: "/posts/:id/related",
    description: ""
  },
  CREATE_POST_SELF: {
    method: "post",
    route: "/posts",
    description: ""
  },
  UPDATE_POST: {
    method: "put",
    route: "/posts/:id",
    description: ""
  },
  DELETE_POST: {
    method: "delete",
    route: "/posts/:id",
    description: ""
  },
  INCREMENT_VIEWS: {
    method: "put",
    route: "/posts/:id/views-plus-plus",
    description: ""
  },
  GET_RANDOM_POSTS_FOR_FEEDS: {
    method: "get",
    route: "/feeds/random/:total",
    description: ""
  },
  GET_RELEVANT_POSTS_FOR_FEEDS: {
    method: "get",
    route: "/feeds/relevant",
    description: ""
  },
  GET_LATEST_POSTS_FOR_FEEDS: {
    method: "get",
    route: "/feeds/latest",
    description: ""
  },
  GET_TOP_POSTS_FOR_FEEDS: {
    method: "get",
    route: "/feeds/top",
    description: ""
  },
  GET_CATEGORIES: {
    method: "get",
    route: "/categories",
    description: ""
  },
  GET_POPULAR_CATEGORIES: {
    method: "get",
    route: "/categories/popular",
    description: ""
  },
  GET_TAGS: {
    method: "get",
    route: "/tags",
    description: ""
  },
  GET_LIKES_COUNT_IN_POST: {
    method: "get",
    route: "/likes/:postId",
    description: ""
  },
  GET_LIKED_POSTS_BY_USER_SELF: {
    method: "get",
    route: "/likes",
    description: ""
  },
  LIKE_POST_SELF: {
    method: "post",
    route: "/likes/:postId",
    description: ""
  },
  UNLIKE_POST: {
    method: "delete",
    route: "/likes/:id",
    description: ""
  },
  GET_COMMENTS_IN_POSTS: {
    method: "get",
    route: "/comments/:postId",
    description: ""
  },
  GET_ROOT_COMMENTS_IN_POSTS: {
    method: "get",
    route: "/comments/:postId",
    description: ""
  },
  GET_REPLY_COMMENTS_IN_POSTS: { // ??
    method: "get",
    route: "/comments/:commentId",
    description: ""
  },
  CREATE_COMMENT_SELF: {
    method: "post",
    route: "/comments/:postId",
    description: ""
  },
  UPDATE_COMMENT: {
    method: "put",
    route: "/comments/:id",
    description: ""
  },
  DELETE_COMMENT: {
    method: "delete",
    route: "/comments/:id",
    description: ""
  },
  COUNT_FOLLOWS: {
    method: "get",
    route: "/follows/:userId/total",
    description: ""
  },
  GET_FOLLOWERS: {
    method: "get",
    route: "/follows/followers/:userId",
    description: ""
  },
  GET_FOLLOWINGS: {
    method: "get",
    route: "/follows/followings/:userId",
    description: ""
  },
  FOLLOW_USER_SELF: {
    method: "post",
    route: "/follows/:targetId",
    description: ""
  },
  UNFOLLOW_USER_SELF: {
    method: "delete",
    route: "/follows/:id",
    description: ""
  },
  GET_SHARED_POSTS: {
    method: "get",
    route: "/shares/:userId",
    description: ""
  },
  SHARE_POST: {
    method: "post",
    route: "/shares",
    description: ""
  },
  UPDATE_SHARED_POST: {
    method: "put",
    route: "/shares/:id",
    description: ""
  },
  DELETE_SHARED_POST: {
    method: "delete",
    route: "/shares/:id",
    description: ""
  },
  GET_NOTIFICATIONS_SELF: {
    method: "get",
    route: "/notifications",
    description: ""
  },
  CREATE_NOTIFICATION: { // ??
    method: "post",
    route: "/notifications/:userId",
    description: ""
  },
  GET_SUBSCRIPTION: {
    method: "get",
    route: "/subscriptions/:targetId",
    description: ""
  },
  CREATE_SUBSCRIPTION_SELF: {
    method: "post",
    route: "/subscriptions/:targetId",
    description: ""
  },
  DELETE_SUBSCRIPTION: {
    method: "delete",
    route: "/subscriptions/:id",
    description: ""
  },
};

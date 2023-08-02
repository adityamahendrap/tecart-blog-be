import "dotenv/config";
import express from "express";
import mongoose from 'mongoose';
import cors from "cors";
import errHandler from "./middlewares/errHandler.js";
import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";
import categoryRoute from "./routes/category.js";
import postRoute from './routes/post.js';
import likeRoute from './routes/like.js';
import followRoute from './routes/follow.js';
import shareRoute from './routes/share.js';
import bookmarkRoute from './routes/bookmark.js';
import subscriptionRoute from './routes/subscription.js';
import commentRoute from './routes/comment.js';
import feedRoute from './routes/feed.js';
import cacheMiddleware from './middlewares/cacheMiddleware.js';

const app = express();
const port = process.env.SERVER_PORT || 3000;

mongoose.connect(process.env.MONGO_LOCAL_URI)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});
mongoose.connection.on('error', (err) => console.log(err))
mongoose.connection.once('open', () => console.log('Database Connected'))

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app.use("/api/auth", authRoute);
app.use(cacheMiddleware);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/feeds", feedRoute);
app.use("/api/likes", likeRoute);
app.use("/api/comments", commentRoute);
app.use("/api/shares", shareRoute);
app.use("/api/follows", followRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/subscriptions", subscriptionRoute);
app.use("/api/bookmarks", bookmarkRoute);
app.use(errHandler);

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});

import "dotenv/config";
import express from "express";
import mongoose from 'mongoose';
import cors from "cors";
import routes from './routes/routes.js';
import errHandler from "./middlewares/errHandler.js";

const app = express();
const port = process.env.SERVER_PORT || 3000;

mongoose.connect(process.env.MONGO_LOCAL_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));
mongoose.connection.on('error', (err) => console.log(err))
mongoose.connection.once('open', () => console.log('Database Connected'))

app.use(express.json());
app.use(cors());

app.use("/api", routes);
app.use(errHandler);

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});

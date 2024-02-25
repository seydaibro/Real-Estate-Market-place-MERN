import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listRouter from './routes/listing.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

// Use cors middleware
app.use(cors({
  origin: 'https://real-estate-market-place-mern.vercel.app',
  credentials: true,
}));

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connection succeeded");

    app.listen(3000, () => {
      console.log("Listening on port 3000");
    });
  })
  .catch(err => {
    console.error("Connection error:", err);
  });

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

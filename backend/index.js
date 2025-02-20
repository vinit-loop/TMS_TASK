import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user/UserRoute.js";

import cors from "cors";
import authRoutes from "./routes/authRoute.js";
import CategoryRouter from "./routes/category/CategoryRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/", userRouter);

app.use("/api/category", CategoryRouter);

const connect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/MCM");
    console.log("success");
  } catch (error) {
    console.log("unable to connect");
  }
};
connect();

app.listen(8000, () => console.log("Server running on port 8000"));

export default app;

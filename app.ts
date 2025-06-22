import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { appErrorHandler } from "./src/middlewares/errorHandlers.middleware.js";
import rootRouter from "./src/routes/index.route.js";

const app = express();
dotenv.config();

const corsConfig = {
  origin: process.env.FRONTEND_ORIGIN_DEV,
  credentials: true, // Allow cookies (important)
};

app.use(express.json()); // Enable parsing of JSON request bodies from raw stream
app.use(cookieParser());
app.use(cors(corsConfig));

app.use(rootRouter);
app.use(appErrorHandler);
app.listen(3030);

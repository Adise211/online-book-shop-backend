import express from "express";
import router from "./src/routes/index.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { appErrorHandler } from "./src/middlewares/errorHandlers.middleware.js";

const app = express();
dotenv.config();

const corsConfig = {
  origin: process.env.FRONTEND_ORIGIN_DEV,
  credentials: true, // Allow cookies (important)
};

app.use(express.json()); // Enable parsing of JSON request bodies from raw stream
app.use(cookieParser());
app.use(cors(corsConfig));

app.use(router);
app.use(appErrorHandler);
app.listen(3030);

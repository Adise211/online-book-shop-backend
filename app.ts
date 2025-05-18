import express from "express";
import router from "./src/routes/index.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { appErrorHandler } from "./src/middlewares/errorHandlers.js";

const app = express();
dotenv.config();

app.use(express.json()); // Enable parsing of JSON request bodies from raw stream
app.use(cookieParser());

app.use(router);
app.use(appErrorHandler);
app.listen(3030);

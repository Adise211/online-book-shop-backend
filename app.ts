import express from "express";
import router from "./src/routes/index.js";
import dotenv from "dotenv";
import { appErrorHandler } from "./src/middlewares/errorHandlers.js";

const app = express();
dotenv.config();

app.use(express.json()); // Enable parsing of JSON request bodies from raw stream

app.use(router);
app.use(appErrorHandler);
app.listen(3030);

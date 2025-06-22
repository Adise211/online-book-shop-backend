import express from "express";
import userRouter from "./users.route.js";
import bookRouter from "./books.route.js";
import reviewRouter from "./reviews.route.js";

const rootRouter = express.Router();

rootRouter.use("/api/v1/users", userRouter);
rootRouter.use("/api/v1/books", bookRouter);
rootRouter.use("/api/v1/reviews", reviewRouter);

export default rootRouter;

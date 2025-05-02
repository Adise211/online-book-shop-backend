import express from "express";
// import todoRoutes from "./routes/todos.js";

const app = express();

app.use(express.json());
// app.use(todoRoutes);
// /* express global error handler (middleware) */
// app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
//   res.status(500).json({ message: `An error occurred! \n ${error}` });
// });

app.get("/", (req, res) => {
  console.log(req.method);
  res.json({ message: "Halo Word!" });
});

app.listen(3030);

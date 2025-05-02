import express from "express";
const router = express.Router();

// router.post("/todos", (req, res) => {
//   /* Notice: body treated with type 'any' */
//   const { text } = req.body;

//   const addedTodo = addTodo(text);
//   res.json({ message: "Todo added!", data: addedTodo });
// });

// router.get("/todos", (req, res) => {
//   const todos = getTodos();
//   res.json({ todos });
// });

// router.get("/todos/:id", (req, res) => {
//   /* Notice: params return values as  strings */
//   const todo = getTodo(+req.params.id);
//   res.json(todo);
// });

export default router;

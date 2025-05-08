import express from "express";
import router from "./src/routes/index.js";

const app = express();

app.use(express.json()); // Enable parsing of JSON request bodies from raw stream

app.use(router);
app.listen(3030);

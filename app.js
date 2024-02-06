import express from "express";
import morgan from "morgan"
import router from "./src/routes/index.js";
import cors from "cors";
import {handleError, CustomError} from "./src/utils/Error.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"))

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Tran Tho Backend." });
});

app.use("/api", router);

app.use(function (req, res, next) {
  handleError(res, new CustomError("Route not found", 404))
});



export default app;

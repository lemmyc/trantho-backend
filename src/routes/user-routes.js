import { Router } from "express";
import { signUpUser } from "../controllers/user-controllers.js";

const userRoutes = Router();

userRoutes.post("/signup", signUpUser);


export default userRoutes;
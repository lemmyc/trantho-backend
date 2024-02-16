import { Router } from "express";
import { signUpUser, logInUser, logOutUser, validateUserRole, requestRefreshToken } from "../controllers/user-controllers.js";

const userRoutes = Router();

userRoutes.post("/signup", signUpUser);
userRoutes.post("/login", logInUser);
userRoutes.post("/logout", logOutUser);
userRoutes.post("/validate", validateUserRole);
userRoutes.post("/refresh-token", requestRefreshToken);


export default userRoutes;
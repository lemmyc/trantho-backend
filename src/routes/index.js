import { Router } from "express";
import userRoutes from "./user-routes.js";
import customerRoutes from "./customer-routes.js";
import staffRoutes from "./staff-routes.js";
const router = Router();

router.use("/user", userRoutes);
router.use("/customer", customerRoutes);
router.use("/staff", staffRoutes);

export default router;
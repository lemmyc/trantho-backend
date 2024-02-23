import { Router } from "express";
import userRoutes from "./user-routes.js";
import customerRoutes from "./customer-routes.js";
import staffRoutes from "./staff-routes.js";
import brandRoutes from "./brand-routes.js";
import productRoutes from "./product-routes.js";
import manufactorRoutes from "./manufactor-routes.js";
import inwardNoteRoutes from "./inward-note-routes.js";
import cartRoutes from "./cart-routes.js";
import orderRoutes from "./order-routes.js";
const router = Router();

router.use("/user", userRoutes);
router.use("/customer", customerRoutes);
router.use("/staff", staffRoutes);
router.use("/brand", brandRoutes);
router.use("/product", productRoutes);
router.use("/manufactor", manufactorRoutes);
router.use("/inward-note", inwardNoteRoutes);
router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);

export default router;
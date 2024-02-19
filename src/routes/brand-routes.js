import { Router } from "express";
import { getBrandById, getAllBrands, addBrand, editBrand } from "../controllers/brand-controllers.js";

const brandRoutes = Router();
brandRoutes.route("/")
    .get(getAllBrands);
brandRoutes.route("/:id")
    .get(getBrandById);
brandRoutes.route("/add")
    .post(addBrand);
brandRoutes.route("/edit/:id")
    .put(editBrand);

export default brandRoutes;
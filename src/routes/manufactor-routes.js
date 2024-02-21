import { Router } from "express";
import { addManufactor, editManufactor, getManufactorById, getAllManufactors } from "../controllers/manufactor-controllers.js";

const manufactorRoutes = Router();

manufactorRoutes.route("/")
    .get(getAllManufactors);
manufactorRoutes.route("/:id")
    .get(getManufactorById);
manufactorRoutes.route("/add")
    .post(addManufactor);
manufactorRoutes.route("/edit/:id")
    .put(editManufactor);

export default manufactorRoutes;
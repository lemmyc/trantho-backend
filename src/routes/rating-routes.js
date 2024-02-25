import { Router } from "express";
import { addRating, editRating, getRatingByCustomer, deleteRating } from "../controllers/rating-controllers.js";

const ratingRoutes = Router();
ratingRoutes.route("/customer-rating")
    .get(getRatingByCustomer);
ratingRoutes.route("/add")
    .post(addRating);
ratingRoutes.route("/edit/:id")
    .put(editRating);
ratingRoutes.route("/delete/:id")
    .delete(deleteRating);

export default ratingRoutes;
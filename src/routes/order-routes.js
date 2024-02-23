import { Router } from "express";
import { addOrderByCustomer, addOrderByStaff } from "../controllers/order-controllers.js";

const orderRoutes = Router();

// orderRoutes.route("/")
//     .get(getAllInwardNotes);
// orderRoutes.route("/:id")
//     .get(getInwardNoteById);
orderRoutes.route("/customer/add")
    .post(addOrderByCustomer);
orderRoutes.route("/staff/add")
    .post(addOrderByStaff);
// orderRoutes.route("/edit/:id")
//     .put(editInwardNote);

export default orderRoutes;
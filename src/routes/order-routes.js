import { Router } from "express";
import {
  getOrderById,

  getAllOrdersByCustomer,
  addOrderByCustomer,

  getAllOrdersByStaffWithUserId,
  addOrderByStaff,
  editOrderByStaff,
} from "../controllers/order-controllers.js";

const orderRoutes = Router();

// orderRoutes.route("/")
//     .get(getAllInwardNotes);
orderRoutes.route("/:id").get(getOrderById);

orderRoutes.route("/customer/").get(getAllOrdersByCustomer);
orderRoutes.route("/customer/add").post(addOrderByCustomer);

orderRoutes.route("/staff/add").post(addOrderByStaff);
orderRoutes.route("/staff/edit/:id").put(editOrderByStaff);
orderRoutes
  .route("/staff/get-customer-orders")
  .get(getAllOrdersByStaffWithUserId);
export default orderRoutes;

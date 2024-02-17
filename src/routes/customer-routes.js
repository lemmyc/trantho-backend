import { Router } from "express";
import { signUpCustomer, getCustomerById, getAllCustomers, updateCustomer} from "../controllers/customer-controllers.js";

const customerRoutes = Router();

customerRoutes.post("/signup", signUpCustomer);

customerRoutes.route("/")
    .get(getAllCustomers);

customerRoutes.route("/:id")
    .put(updateCustomer)
    .get(getCustomerById);

export default customerRoutes;
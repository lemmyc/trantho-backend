import { Router } from "express";
import { addItemToCart, editCart, getCartWithUserID, deleteCart } from "../controllers/cart-controllers.js";

const cartRoutes = Router();
// cartRoutes.route("/")
//     .get(getAllCarts);
cartRoutes.route("/get-user-cart")
    .get(getCartWithUserID);
cartRoutes.route("/add-item")
    .post(addItemToCart);
cartRoutes.route("/edit/:id")
    .put(editCart);
cartRoutes.route("/delete")
    .delete(deleteCart);
export default cartRoutes;
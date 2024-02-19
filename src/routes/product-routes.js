import { Router } from "express";
import { addProduct, editProduct, getProductById, getAllProducts, deleteProduct } from "../controllers/product-controllers.js";

const productRoutes = Router();
productRoutes.route("/")
    .get(getAllProducts);
productRoutes.route("/:id")
    .get(getProductById);
productRoutes.route("/add")
    .post(addProduct);
productRoutes.route("/edit/:id")
    .put(editProduct);
productRoutes.route("/delete/:id")
    .delete(deleteProduct);
export default productRoutes;
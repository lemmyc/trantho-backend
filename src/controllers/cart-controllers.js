import { CustomError, handleError } from "../utils/Error.js";
import Cart from "../models/Cart.js";
import Customer from "../models/Customer.js";
import Product from "../models/Product.js";
import TokenUtils from "../utils/token-utils.js";

import mongoose from "mongoose";
export const addItemToCart = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { productId, productQuantiy } = req.body;

    if (!authorization || authorization === "Bearer") {
      handleError(res, new CustomError("Token not found", 400));
      return;
    }
    const token = authorization.substring(7);
    const customerId = TokenUtils.decodeToken(token)._id;

    const existedCustomer = await Customer.findOne({
      user: new mongoose.Types.ObjectId(customerId),
    });
    if (!existedCustomer) {
      handleError(res, new CustomError("Customer not found", 404));
      return;
    }

    const existedCart = await Cart.findOne({
      customer: new mongoose.Types.ObjectId(customerId),
    });
    if (!existedCart) {
      handleError(res, new CustomError("Cart not found", 404));
      return;
    }
    const existedProduct = await Product.findById(productId);
    if (!existedProduct) {
      handleError(
        res,
        new CustomError(`Product not found with ID ${productId}`, 404)
      );
      return;
    }

    const existingCartItemIndex = existedCart.cartItems.findIndex((item) =>
      item.product.equals(productId)
    );

    if (existingCartItemIndex !== -1) {
      existedCart.cartItems[existingCartItemIndex].productCartQuantity +=
        Number(productQuantiy);
    } else {
      existedCart.cartItems.push({
        product: productId,
        productCartQuantity: Number(productQuantiy),
      });
    }
    if (
      Number(
        existedCart.cartItems.at(existingCartItemIndex).productCartQuantity
      ) > Number(existedProduct.productQuantity)
    ) {
      handleError(
        res,
        new CustomError(
          `Cart Product with ID ${productId} quantity exceeds quantity in the storage`,
          422
        )
      );
      return;
    }
    await existedCart.save();
    return res.status(200).json({
      message: "Add item to cart successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const editCart = async (req, res) => {
  try {
    const cartId = req.params.id;
    const { authorization } = req.headers;
    const { cartItems } = req.body;

    if (!authorization || authorization === "Bearer") {
      handleError(res, new CustomError("Token not found", 400));
      return;
    }
    const token = authorization.substring(7);
    const customerId = TokenUtils.decodeToken(token)._id;
    const existedCustomer = await Customer.findOne({
      user: new mongoose.Types.ObjectId(customerId),
    });
    if (!existedCustomer) {
      handleError(res, new CustomError("Customer not found", 404));
      return;
    }

    const existedCart = await Cart.findById(cartId);
    if (!existedCart) {
      handleError(res, new CustomError("Cart not found to update", 404));
      return;
    }

    if (existedCart.customer.toString() !== customerId) {
      handleError(
        res,
        new CustomError(
          "Provided Customer Id and Cart Customer Id not match",
          409
        )
      );
      return;
    }

    for (const item of cartItems) {
      const existedProductInStorage = await Product.findById(item.product);
      if (!existedProductInStorage) {
        handleError(
          res,
          new CustomError(`Product not found with ID ${item.product}`, 404)
        );
        return;
      }
      if (
        Number(item.productCartQuantity) >
        Number(existedProductInStorage.productQuantity)
      ) {
        handleError(
          res,
          new CustomError(
            `Cart Product with ID ${item.product} quantity exceeds quantity in the storage`,
            422
          )
        );
        return;
      }
    }

    const updateResult = await Cart.updateOne(
      {
        _id: new mongoose.Types.ObjectId(cartId),
      },
      { customer: customerId, ...req.body }
    );
    return res.status(200).json({
      message: "Cart updated successfully",
      detail: updateResult,
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const getCartWithUserID = async (req, res) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || authorization === "Bearer") {
      handleError(res, new CustomError("Token not found", 400));
      return;
    }
    const token = authorization.substring(7);
    const customerId = TokenUtils.decodeToken(token)._id;
    const existedCustomer = await Customer.findOne({
      user: new mongoose.Types.ObjectId(customerId),
    });
    if (!existedCustomer) {
      handleError(res, new CustomError("Customer not found", 404));
      return;
    }

    const existedCart = await Cart.findOne({
      customer: new mongoose.Types.ObjectId(customerId),
    });
    if (!existedCart) {
      handleError(res, new CustomError("Customer's Cart not found", 404));
      return;
    }

    const cartData = existedCart.toJSON();
    delete cartData._id;
    delete cartData.createdAt;
    delete cartData.updatedAt;
    delete cartData.__v;
    const cartItems = cartData.cartItems;
    for (const item of cartItems) {
      const existedProductInStorage = await Product.findById(item.product);
      if (!existedProductInStorage) {
        handleError(
          res,
          new CustomError(`Product not found with ID ${item.product}`, 404)
        );
        return;
      }
      const productData = existedProductInStorage.toJSON();
      item.productName = productData.productName;
      if (
        productData.discountPercent > 0 &&
        productData?.discountStartDate <= new Date() &&
        productData?.discountEndDate >= new Date()
      ) {
        const discountedPrice =
          productData.productPrice * (1 - productData.discountPercent / 100);
        const totalPrice = discountedPrice * item.productCartQuantity;
        item.originalPrice = productData.productPrice;
        item.discountPercent = productData.discountPercent;
        item.discountedPrice = productData.discountedPrice;
        item.totalPrice = totalPrice.toFixed(2);
        item.isDiscounted = true;
      } else {
        const totalPrice = productData.productPrice * item.productCartQuantity;
        item.originalPrice = productData.productPrice;
        item.totalPrice = totalPrice.toFixed(2);
        item.isDiscounted = false;
      }
      delete item._id;
    }
    return res.status(200).json({
      data: {
        ...cartData,
      },
      message: "Get Cart data successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const deleteCart = async (req, res) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || authorization === "Bearer") {
      handleError(res, new CustomError("Token not found", 400));
      return;
    }
    const token = authorization.substring(7);
    const customerId = TokenUtils.decodeToken(token)._id;
    const existedCustomer = await Customer.findOne({
      user: new mongoose.Types.ObjectId(customerId),
    });
    if (!existedCustomer) {
      handleError(res, new CustomError("Customer not found", 404));
      return;
    }

    const existedCart = await Cart.findOne({
      customer: new mongoose.Types.ObjectId(customerId),
    });
    if (!existedCart) {
      handleError(res, new CustomError("Customer's Cart not found", 404));
      return;
    }

    const updateResult = await Cart.updateOne(
      {
        customer: new mongoose.Types.ObjectId(customerId),
      },
      { cartItems: [] }
    );

    return res.status(200).json({
      message: "Cart deleted successfully",
      detail: updateResult,
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};

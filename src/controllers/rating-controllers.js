import { CustomError, handleError } from "../utils/Error.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";
import Order from "../models/Order.js";
import Rating from "../models/Rating.js";
import mongoose from "mongoose";
export const addRating = async (req, res) => {
  try {
    const {
      customerId,
      orderId,
      productId,
      ratingDate,
      ratingStars,
      ratingComment = "",
    } = req.body;
    
    const existedRating = await Rating.findOne({
      customer: new mongoose.Types.ObjectId(customerId),
      order: new mongoose.Types.ObjectId(orderId),
      product: new mongoose.Types.ObjectId(productId),
    });
    if (existedRating) {
      handleError(res, new CustomError("Rating existed", 403));
      return;
    }

    const existedCustomer = await Customer.findOne({
      user: new mongoose.Types.ObjectId(customerId),
    });
    if (!existedCustomer) {
      handleError(res, new CustomError("Customer not found", 404));
      return;
    }

    const existedOrder = await Order.findById(orderId);
    if (!existedOrder) {
      handleError(res, new CustomError("Order not found", 404));
      return;
    }
    const orderData = existedOrder.toJSON();
    if(orderData.customer.toString() !== customerId){
      handleError(res, new CustomError("Order not belong to customer", 422));
      return;
    }

    const existedProduct = await Product.findById(productId);
    if (!existedProduct) {
      handleError(res, new CustomError("Product not found", 404));
      return;
    }
    const existedProductInOrder = orderData.orderGoods.find((orderItem => orderItem.product.toString() === productId))
    if(!existedProductInOrder){
      handleError(res,new CustomError("This product is not in this order", 422))
      return
    }

    if (Number(ratingStars) < 0 || Number(ratingStars) > 5) {
      handleError(res, new CustomError("Rating stars must be between 0-5", 400));
      return;
    }


    const newRating = await Rating.create({
      customer: customerId,
      order: orderId,
      product: productId,
      ratingDate,
      ratingStars: Number(ratingStars),
      ratingComment
    }).then((data) => data.toJSON());
    delete newRating.createdAt;
    delete newRating.updatedAt;
    delete newRating.__v;
    return res.status(200).json({
      data: {
        ...newRating,
      },
      message: "Add new Rating successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const editRating = async (req, res) => {
  try {
    const ratingId = req.params.id;
    const {
      customerId,
      orderId,
      productId,
      ratingStars,
      ratingComment = "",
    } = req.body;
    const existedRating = await Rating.findOne({
      _id: new mongoose.Types.ObjectId(ratingId),
      customer: new mongoose.Types.ObjectId(customerId),
      order: new mongoose.Types.ObjectId(orderId),
      product: new mongoose.Types.ObjectId(productId),
    });
    if (!existedRating) {
      handleError(res, new CustomError("Rating not found to update", 404));
      return;
    }

    const existedCustomer = await Customer.findOne({
      user: new mongoose.Types.ObjectId(customerId),
    });
    if (!existedCustomer) {
      handleError(res, new CustomError("Customer not found", 404));
      return;
    }

    const existedOrder = await Order.findById(orderId);
    if (!existedOrder) {
      handleError(res, new CustomError("Order not found", 404));
      return;
    }
    const orderData = existedOrder.toJSON();
    if(orderData.customer.toString() !== customerId){
      handleError(res, new CustomError("Order not belong to customer", 422));
      return;
    }

    const existedProduct = await Product.findById(productId);
    if (!existedProduct) {
      handleError(res, new CustomError("Product not found", 404));
      return;
    }
    const existedProductInOrder = orderData.orderGoods.find((orderItem => orderItem.product.toString() === productId))
    if(!existedProductInOrder){
      handleError(res,new CustomError("This product is not in this order", 422))
      return
    }

    if (Number(ratingStars) < 0 || Number(ratingStars) > 5) {
      handleError(res, new CustomError("Rating stars must be between 0-5", 400));
      return;
    }
    const updateResult = await Rating.updateOne(
      {
        _id: new mongoose.Types.ObjectId(ratingId),
      },
      {
        ratingStars: Number(ratingStars),
        ratingComment
      }
    );
    return res.status(200).json({
      message: "Rating updated successfully",
      detail: updateResult,
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const getRatingByCustomer = async (req, res) => {
  try {
    const {
      customerId,
    } = req.body;

    const existedCustomer = await Customer.findOne({
      user: new mongoose.Types.ObjectId(customerId),
    });
    if (!existedCustomer) {
      handleError(res, new CustomError("Customer not found", 404));
      return;
    }

    const existedCustomerRatings = await Rating.find({
      customer: new mongoose.Types.ObjectId(customerId),
    }).lean();
    for (const rating of existedCustomerRatings){
      const ratingProduct = await Product.findById(rating.product);
      rating.productName = ratingProduct?.productName || "Hàng hóa không xác định";
      delete  rating.customer;
      delete  rating.createdAt;
      delete  rating.updatedAt;
      delete  rating.__v;
    }

    return res.status(200).json({
      data: {
        ...existedCustomerRatings,
      },
      message: "Get Customer Ratings successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const deleteRating = async (req, res) => {
  try {
    const ratingId = req.params.id;
    const {
      customerId,
      orderId,
      productId,
      ratingStars,
      ratingComment = "",
    } = req.body;
    const existedRating = await Rating.findOne({
      _id: new mongoose.Types.ObjectId(ratingId),
      customer: new mongoose.Types.ObjectId(customerId),
      order: new mongoose.Types.ObjectId(orderId),
      product: new mongoose.Types.ObjectId(productId),
    });
    if (!existedRating) {
      handleError(res, new CustomError("Rating not found to update", 404));
      return;
    }

    const existedCustomer = await Customer.findOne({
      user: new mongoose.Types.ObjectId(customerId),
    });
    if (!existedCustomer) {
      handleError(res, new CustomError("Customer not found", 404));
      return;
    }

    const existedOrder = await Order.findById(orderId);
    if (!existedOrder) {
      handleError(res, new CustomError("Order not found", 404));
      return;
    }
    const orderData = existedOrder.toJSON();
    if(orderData.customer.toString() !== customerId){
      handleError(res, new CustomError("Order not belong to customer", 422));
      return;
    }

    const existedProduct = await Product.findById(productId);
    if (!existedProduct) {
      handleError(res, new CustomError("Product not found", 404));
      return;
    }
    const existedProductInOrder = orderData.orderGoods.find((orderItem => orderItem.product.toString() === productId))
    if(!existedProductInOrder){
      handleError(res,new CustomError("This product is not in this order", 422))
      return
    }
    const deleteResult = await Rating.deleteOne(
      {
        _id: new mongoose.Types.ObjectId(ratingId),
      }
    );
    return res.status(200).json({
      message: "Rating deleted successfully",
      detail: deleteResult,
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};

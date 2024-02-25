import { CustomError, handleError } from "../utils/Error.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import mongoose from "mongoose";
import { ORDER_STATUS, PAYMENT_METHOD } from "../config/constants.js";
import TokenUtils from "../utils/token-utils.js";

export const addOrderByCustomer = async (req, res) => {
  try {
    const { authorization } = req.headers;

    const {
      orderGoods,
      orderDate,
      orderNote = "",
      orderPaymentMethod = "NOT_PROVIDED",
      orderDeliveryAddress,
    } = req.body;

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
    if (!orderGoods || orderGoods?.length <= 0) {
      handleError(res, new CustomError(`No product in order`, 422));
      return;
    }
    for (const item of orderGoods) {
      const existedProductInStorage = await Product.findById(item.product);
      if (!existedProductInStorage) {
        handleError(
          res,
          new CustomError(`Product not found with ID ${item.product}`, 404)
        );
        return;
      }
      if (
        Number(item.productOrderQuantity) >
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
    if (orderPaymentMethod === "NOT_PROVIDED") {
      handleError(res, new CustomError(`Payment method not found`, 400));
      return;
    }
    if (
      orderPaymentMethod !== "NOT_PROVIDED" &&
      !(orderPaymentMethod in PAYMENT_METHOD)
    ) {
      handleError(
        res,
        new CustomError(
          `Payment method ${orderPaymentMethod} not supported`,
          422
        )
      );
      return;
    }
    if (!orderDeliveryAddress) {
      handleError(
        res,
        new CustomError(`Order Delivery Address can not be empty`, 400)
      );
      return;
    }

    let totalPrice = 0;
    for (const item of orderGoods) {
      if (item?.productOrderDiscountedPrice) {
        totalPrice +=
          Number(item.productOrderDiscountedPrice) *
          Number(item.productOrderQuantity);
      } else {
        totalPrice +=
          Number(item.productOrderOriginalPrice) *
          Number(item.productOrderQuantity);
      }
    }

    for (const item of orderGoods) {
      const { product, productOrderQuantity } = item;
      await Product.findOneAndUpdate(
        { _id: product },
        { $inc: { productQuantity: -productOrderQuantity } },
        { new: true }
      );
    }

    const newOrder = await Order.create({
      customer: customerId,
      orderDate,
      orderGoods,
      orderTotalPrice: totalPrice,
      orderNote,
      orderDeliveryAddress,
      orderPaymentMethod,
    }).then((data) => data.toJSON());

    return res.status(200).json({
      data: {
        orderId: newOrder._id,
      },
      message: "Add new Order successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const addOrderByStaff = async (req, res) => {
  try {
    const {
      orderGoods,
      customerId,
      orderDate,
      orderNote = "",
      orderPaymentMethod = "NOT_PROVIDED",
      orderDeliveryAddress,
    } = req.body;

    const existedCustomer = await Customer.findOne({
      user: new mongoose.Types.ObjectId(customerId),
    });
    if (!existedCustomer) {
      handleError(res, new CustomError("Customer not found", 404));
      return;
    }
    if (!orderGoods || orderGoods?.length <= 0) {
      handleError(res, new CustomError(`No product in order`, 422));
      return;
    }
    for (const item of orderGoods) {
      const existedProductInStorage = await Product.findById(item.product);
      if (!existedProductInStorage) {
        handleError(
          res,
          new CustomError(`Product not found with ID ${item.product}`, 404)
        );
        return;
      }
      if (
        Number(item.productOrderQuantity) >
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
    if (orderPaymentMethod === "NOT_PROVIDED") {
      handleError(res, new CustomError(`Payment method not found`, 400));
      return;
    }
    if (
      orderPaymentMethod !== "NOT_PROVIDED" &&
      !(orderPaymentMethod in PAYMENT_METHOD)
    ) {
      handleError(
        res,
        new CustomError(
          `Payment method ${orderPaymentMethod} not supported`,
          422
        )
      );
      return;
    }
    if (!orderDeliveryAddress) {
      handleError(
        res,
        new CustomError(`Order Delivery Address can not be empty`, 400)
      );
      return;
    }

    let totalPrice = 0;
    for (const item of orderGoods) {
      if (item?.productOrderDiscountedPrice) {
        totalPrice +=
          Number(item.productOrderDiscountedPrice) *
          Number(item.productOrderQuantity);
      } else {
        totalPrice +=
          Number(item.productOrderOriginalPrice) *
          Number(item.productOrderQuantity);
      }
    }

    for (const item of orderGoods) {
      const { product, productOrderQuantity } = item;
      await Product.findOneAndUpdate(
        { _id: product },
        { $inc: { productQuantity: -productOrderQuantity } },
        { new: true }
      );
    }

    const newOrder = await Order.create({
      customer: customerId,
      orderDate,
      orderGoods,
      orderTotalPrice: totalPrice,
      orderNote,
      orderDeliveryAddress,
      orderPaymentMethod,
    }).then((data) => data.toJSON());

    return res.status(200).json({
      data: {
        orderId: newOrder._id,
      },
      message: "Add new Order successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const editOrderByStaff = async (req, res) => {
  try {
    const orderId = req.params.id;
    const {
      orderGoods,
      customerId,
      orderDate,
      orderNote = "",
      orderStatus = "NOT_PROVIDED",
      orderPaymentMethod = "NOT_PROVIDED",
      orderDeliveryAddress,
    } = req.body;

    const existedOrder = await Order.findById(orderId);
    if (!existedOrder) {
      handleError(res, new CustomError("Order not found", 404));
      return;
    }
    const existedOrderData = existedOrder.toJSON();
    const existedCustomer = await Customer.findOne({
      user: new mongoose.Types.ObjectId(customerId),
    });
    if (!existedCustomer) {
      handleError(res, new CustomError("Customer not found", 404));
      return;
    }
    if (!orderGoods || orderGoods?.length <= 0) {
      handleError(res, new CustomError(`No product in order`, 422));
      return;
    }
    for (const item of orderGoods) {
      const existedProductInStorage = await Product.findById(item.product);
      if (!existedProductInStorage) {
        handleError(
          res,
          new CustomError(`Product not found with ID ${item.product}`, 404)
        );
        return;
      }
      if (
        Number(item.productOrderQuantity) >
        Number(existedProductInStorage.productQuantity) +
          Number(
            existedOrderData.orderGoods.find(
              (existedItem) => existedItem.product.toString() === item.product
            )?.productOrderQuantity ?? 0
          )
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
    if (orderPaymentMethod === "NOT_PROVIDED") {
      handleError(res, new CustomError(`Payment method not found`, 400));
      return;
    }
    if (
      orderPaymentMethod !== "NOT_PROVIDED" &&
      !(orderPaymentMethod in PAYMENT_METHOD)
    ) {
      handleError(
        res,
        new CustomError(
          `Payment method ${orderPaymentMethod} not supported`,
          422
        )
      );
      return;
    }

    if (orderStatus === "NOT_PROVIDED") {
      handleError(res, new CustomError(`Order Status not found`, 400));
      return;
    }
    if (
      orderStatus !== "NOT_PROVIDED" &&
      !(orderStatus in ORDER_STATUS)
    ) {
      handleError(
        res,
        new CustomError(
          `Order Status ${orderStatus} invalid`,
          422
        )
      );
      return;
    }

    if (!orderDeliveryAddress) {
      handleError(
        res,
        new CustomError(`Order Delivery Address can not be empty`, 400)
      );
      return;
    }

    for (const item of existedOrderData.orderGoods) {
      const { product, productOrderQuantity } = item;
      await Product.findOneAndUpdate(
        { _id: product },
        { $inc: { productQuantity: +productOrderQuantity } },
        { new: true }
      );
    }

    let totalPrice = 0;
    for (const item of orderGoods) {
      if (item?.productOrderDiscountedPrice) {
        totalPrice +=
          Number(item.productOrderDiscountedPrice) *
          Number(item.productOrderQuantity);
      } else {
        totalPrice +=
          Number(item.productOrderOriginalPrice) *
          Number(item.productOrderQuantity);
      }
    }

    for (const item of orderGoods) {
      const { product, productOrderQuantity } = item;
      await Product.findOneAndUpdate(
        { _id: product },
        { $inc: { productQuantity: -productOrderQuantity } },
        { new: true }
      );
    }

    const updateResult = await Order.updateOne(
      {
        _id: new mongoose.Types.ObjectId(orderId),
      },
      {
        customer: customerId,
        orderDate,
        orderGoods,
        orderTotalPrice: totalPrice,
        orderNote,
        orderStatus,
        orderDeliveryAddress,
        orderPaymentMethod,
      }
    );

    return res.status(200).json({
      message: "Order updated successfully",
      detail: updateResult,
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const existedOrder = await Order.findById(orderId);
    if (!existedOrder) {
      handleError(res, new CustomError("Customer's Order not found", 404));
      return;
    }
    const orderData = existedOrder.toJSON();

    delete orderData._id;
    delete orderData.createdAt;
    delete orderData.updatedAt;
    delete orderData.__v;
    for (const item of orderData.orderGoods) {
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
      delete item._id;
    }

    return res.status(200).json({
      data: {
        ...orderData
      },
      message: "Get Customer's Order data successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const getAllOrdersByCustomer = async (req, res) => {
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

    const existedOrders = await Order.find({
      customer: new mongoose.Types.ObjectId(customerId),
    }).lean();
    if (!existedOrders) {
      handleError(res, new CustomError("Customer's Orders not found", 404));
      return;
    }
    delete existedOrders._id;
    delete existedOrders.createdAt;
    delete existedOrders.updatedAt;
    delete existedOrders.__v;
    for (const order of existedOrders) {
      for (const item of order.orderGoods) {
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
        delete item._id;
      }
      delete order.createdAt;
      delete order.updatedAt;
      delete order.__v;
    }
    const totalRows = existedOrders.length;

    return res.status(200).json({
      data: existedOrders,
      totalRows,
      message: "Get Customer's Orders data successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const getAllOrdersByStaffWithUserId = async (req, res) => {
  try {
    const { customerId } = req.body;
    const existedCustomer = await Customer.findOne({
      user: new mongoose.Types.ObjectId(customerId),
    });
    if (!existedCustomer) {
      handleError(res, new CustomError("Customer not found", 404));
      return;
    }

    const existedOrders = await Order.find({
      customer: new mongoose.Types.ObjectId(customerId),
    }).lean();
    if (!existedOrders) {
      handleError(res, new CustomError("Customer's Orders not found", 404));
      return;
    }
    delete existedOrders._id;
    delete existedOrders.createdAt;
    delete existedOrders.updatedAt;
    delete existedOrders.__v;
    for (const order of existedOrders) {
      for (const item of order.orderGoods) {
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
        delete item._id;
      }
      delete order.createdAt;
      delete order.updatedAt;
      delete order.__v;
    }
    const totalRows = existedOrders.length;

    return res.status(200).json({
      data: existedOrders,
      totalRows,
      message: "Get Customer's Orders data successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
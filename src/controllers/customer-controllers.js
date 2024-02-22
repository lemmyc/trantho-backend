import { CustomError, handleError } from "../utils/Error.js";
import { ROLES } from "../config/constants.js";
import PasswordUtils from "../utils/password-utils.js";
import User from "../models/User.js";
import Customer from "../models/Customer.js";
import Cart from "../models/Cart.js";
import TokenUtils from "../utils/token-utils.js";
import mongoose from "mongoose";
export const signUpCustomer = async (req, res) => {
  try {
    const { username, password } = req.body;
    const availableUser = await User.findOne({
      username,
    });
    if (availableUser) {
      handleError(res, new CustomError("Username Existed", 409));
      return;
    }
    const hashedPassword = await PasswordUtils.hash(password);

    const newUser = await User.create({
      username,
      password: hashedPassword,
    });
    const newCustomer = await Customer.create({
      ...req.body,
      user: new User(newUser)._id,
    });
    const userData = newUser.toJSON();
    await Cart.create({
      customer: new User(newUser)._id,
    })
    // console.log(newCustomer);
    const accessToken = TokenUtils.generateAccessToken(userData);
    const refreshToken = TokenUtils.generateRefreshToken(userData);
    delete userData.password;
    delete userData.deletedAt;
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      secure: process.env.ENVIRONMENT === "PRODUCTION" ? true : false,
    });

    return res.status(200).json({
      data: {
        ...userData,
        accessToken,
      },
      message: "Register successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const getCustomerById = async (req, res) => {
  try {
    const customerId = req.params.id;
    const existedCustomer = await Customer.findOne({
      user: new mongoose.Types.ObjectId(customerId),
    });
    if (!existedCustomer) {
      handleError(res, new CustomError("Customer not found", 404));
      return;
    }
    const customerData = existedCustomer.toJSON();

    return res.status(200).json({
      data: {
        ...customerData,
      },
      message: "Get Customer data successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const getAllCustomers = async (req, res) => {
  try {
    const offset = req.query.offset || 0;
    const pageSize = req.query.pageSize || null;
    const term = req.query.term || null;
    const searchBy = req.query.searchBy || null;
    const filter = {};
    if (term) {
      filter[searchBy] = {
        $regex: term,
        $options: "i",
      };
    }
    const customerList = await Customer.find(filter, "", {
      skip: offset,
      limit: pageSize,
    });
    const totalRows = customerList.length;
    return res.status(200).json({
      data: customerList,
      totalRows,
      message: "Get all Customers data successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const updateCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    const updateResult = await Customer.updateOne(
      {
        user: new mongoose.Types.ObjectId(customerId),
      },
      req.body
    );
    if(updateResult.matchedCount === 0){
      handleError(res, new CustomError("Customer not found to update", 404));
      return;
    }
    return res.status(200).json({
      message: "Customer updated successfully",
      detail: updateResult,
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};

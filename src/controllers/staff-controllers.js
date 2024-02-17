import { CustomError, handleError } from "../utils/Error.js";
import { ROLES } from "../config/constants.js";
import PasswordUtils from "../utils/password-utils.js";
import User from "../models/User.js";
import Staff from "../models/Staff.js";
import TokenUtils from "../utils/token-utils.js";
import mongoose from "mongoose";
export const signUpStaff = async (req, res) => {
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
      role: ROLES.STAFF,
    });
    const newCustomer = await Staff.create({
      ...req.body,
      user: new User(newUser)._id,
    });
    const userData = newUser.toJSON();

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
export const getStaffById = async (req, res) => {
  try {
    const staffId = req.params.id;
    const existedStaff = await Staff.findOne({
      user: new mongoose.Types.ObjectId(staffId),
    });
    if (!existedStaff) {
      handleError(res, new CustomError("Staff not found", 404));
      return;
    }
    const staffData = existedStaff.toJSON();

    return res.status(200).json({
      data: {
        ...staffData,
      },
      message: "Get Staff data successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const getAllStaffs = async (req, res) => {
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
    const staffList = await Staff.find(filter, "", {
      skip: offset,
      limit: pageSize,
    });
    const totalRows = staffList.length;
    return res.status(200).json({
      data: staffList,
      totalRows,
      message: "Get all Staffs data successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const updateStaff = async (req, res) => {
  try {
    const staffId = req.params.id;
    const updateResult = await Staff.updateOne(
      {
        user: new mongoose.Types.ObjectId(staffId),
      },
      req.body
    );
    if(updateResult.matchedCount === 0){
      handleError(res, new CustomError("Staff not found to update", 404));
      return;
    }
    return res.status(200).json({
      message: "Staff updated successfully",
      detail: updateResult,
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};

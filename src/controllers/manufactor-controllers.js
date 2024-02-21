import { CustomError, handleError } from "../utils/Error.js";
import Manufactor from "../models/Manufactor.js";
import mongoose from "mongoose";
export const addManufactor = async (req, res) => {
  try {
    const { manufactorName } = req.body;
    const existedManufactor = await Manufactor.findOne({
      manufactorName,
    });
    if (existedManufactor) {
      handleError(res, new CustomError("Manufactor name Existed", 409));
      return;
    };

    const newManufactor = await Manufactor.create({
      ...req.body
    }).then((data) => data.toJSON());

    return res.status(200).json({
      data: {
        ...newManufactor
      },
      message: "Add new Manufactor successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const editManufactor = async (req, res) => {
  try {
    const manufactorId = req.params.id;
    const updateResult = await Manufactor.updateOne(
      {
        _id: new mongoose.Types.ObjectId(manufactorId),
      },
      req.body
    );
    if(updateResult.matchedCount === 0){
      handleError(res, new CustomError("Manufactor not found to update", 404));
      return;
    }
    return res.status(200).json({
      message: "Manufactor updated successfully",
      detail: updateResult,
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const getManufactorById = async (req, res) => {
  try {
    const manufactorId = req.params.id;
    const existedManufactor = await Manufactor.findById(manufactorId);
    if (!existedManufactor) {
      handleError(res, new CustomError("Manufactor not found", 404));
      return;
    }
    const manufactorData = existedManufactor.toJSON();

    return res.status(200).json({
      data: {
        ...manufactorData,
      },
      message: "Get Manufactor data successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const getAllManufactors = async (req, res) => {
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
    const manufactorList = await Manufactor.find(filter, "", {
      skip: offset,
      limit: pageSize,
    });
    const totalRows = manufactorList.length;
    return res.status(200).json({
      data: manufactorList,
      totalRows,
      message: "Get all Manufactors data successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};


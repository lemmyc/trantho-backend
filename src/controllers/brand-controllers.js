import { CustomError, handleError } from "../utils/Error.js";
import Brand from "../models/Brand.js";
import mongoose from "mongoose";
export const addBrand = async (req, res) => {
  try {
    const { brandName, brandDesc } = req.body;
    const existedBrand = await Brand.findOne({
      brandName,
    });
    if (existedBrand) {
      handleError(res, new CustomError("Brand name Existed", 409));
      return;
    };

    const newBrand = await Brand.create({
      brandName,
      brandDesc
    }).then((data) => data.toJSON());

    return res.status(200).json({
      data: {
        ...newBrand
      },
      message: "Add new Brand successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const editBrand = async (req, res) => {
  try {
    const brandId = req.params.id;
    const updateResult = await Brand.updateOne(
      {
        _id: new mongoose.Types.ObjectId(brandId),
      },
      req.body
    );
    if(updateResult.matchedCount === 0){
      handleError(res, new CustomError("Brand not found to update", 404));
      return;
    }
    return res.status(200).json({
      message: "Brand updated successfully",
      detail: updateResult,
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const getBrandById = async (req, res) => {
  try {
    const brandId = req.params.id;
    const existedBrand = await Brand.findById(brandId);
    if (!existedBrand) {
      handleError(res, new CustomError("Brand not found", 404));
      return;
    }
    const brandData = existedBrand.toJSON();

    return res.status(200).json({
      data: {
        ...brandData,
      },
      message: "Get Brand data successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const getAllBrands = async (req, res) => {
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
    const brandList = await Brand.find(filter, "", {
      skip: offset,
      limit: pageSize,
    });
    const totalRows = brandList.length;
    return res.status(200).json({
      data: brandList,
      totalRows,
      message: "Get all Brands data successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};


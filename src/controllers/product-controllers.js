import { CustomError, handleError } from "../utils/Error.js";
import Product from "../models/Product.js";
import Brand from "../models/Brand.js";
import mongoose from "mongoose";
export const addProduct = async (req, res) => {
  try {
    const { productName, brandId } = req.body;

    const existedProduct= await Product.findOne({
      productName,
    });
    if (existedProduct) {
      handleError(res, new CustomError("Product Existed", 409));
      return;
    };

    const existedBrand = await Brand.findById(brandId);
    if (!existedBrand) {
      handleError(res, new CustomError("Brand not found", 404));
      return;
    }

    const newProduct = await Product.create({
      brand: brandId,
      ...req.body
    }).then((data) => data.toJSON());
    delete newProduct.isDeleted;
    return res.status(200).json({
      data: {
        ...newProduct
      },
      message: "Add new Product successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const editProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const existedBrand = await Brand.findById(req.body.brandId);
    if (!existedBrand) {
      handleError(res, new CustomError("Brand not found", 404));
      return;
    }
    const updateResult = await Product.updateOne(
      {
        _id: new mongoose.Types.ObjectId(productId),
      },
      req.body
    );
    if(updateResult.matchedCount === 0){
      handleError(res, new CustomError("Product not found to update", 404));
      return;
    }
    return res.status(200).json({
      message: "Product updated successfully",
      detail: updateResult,
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const existedProduct = await Product.findById(productId);
    if (!existedProduct) {
      handleError(res, new CustomError("Product not found", 404));
      return;
    }
    const productData = existedProduct.toJSON();
    delete productData.isDeleted;

    return res.status(200).json({
      data: {
        ...productData,
      },
      message: "Get Product data successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const getAllProducts = async (req, res) => {
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
    const productList = await Product.find(filter, "", {
      skip: offset,
      limit: pageSize,
    });
    const totalRows = productList.length;
    return res.status(200).json({
      data: productList,
      totalRows,
      message: "Get all Products data successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const existedProduct = await Product.findById(productId);
    if (!existedProduct) {
      handleError(res, new CustomError("Product not found", 404));
      return;
    }
    const updateResult = await Product.updateOne(
      {
        _id: new mongoose.Types.ObjectId(productId),
      },
      {
        isDeleted: true
      }
    );
    if(updateResult.matchedCount === 0){
      handleError(res, new CustomError("Product not found to delete", 404));
      return;
    }
    return res.status(200).json({
      message: "Product deleted successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};


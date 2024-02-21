import { CustomError, handleError } from "../utils/Error.js";
import Product from "../models/Product.js";
import Brand from "../models/Brand.js";
import InwardNote from "../models/InwardNote.js";
import Manufactor from "../models/Manufactor.js";
import Staff from "../models/Staff.js";
import mongoose from "mongoose";
export const addInwardNote = async (req, res) => {
  try {
    const { staffId, manufactorId, goods } = req.body;

    const existedStaff = await Staff.findOne({
      user: new mongoose.Types.ObjectId(staffId),
    });
    if (!existedStaff) {
      handleError(res, new CustomError("Staff not found", 404));
      return;
    }
    const existedManufactor = await Manufactor.findById(manufactorId);
    if (!existedManufactor) {
      handleError(res, new CustomError("Manufactor not found", 404));
      return;
    }

    for (const item of goods) {
      const existedProductInStorage = await Product.findById(item.product);
      if (!existedProductInStorage) {
        handleError(
          res,
          new CustomError(`Product not found with ID ${item.product}`, 404)
        );
        return;
      }
    }

    for (const item of goods) {
      const { product, productImportQuantity } = item;
      await Product.findOneAndUpdate(
        { _id: product },
        { $inc: { productQuantity: +productImportQuantity } },
        { new: true }
      );
    }
    const newInwardNote = await InwardNote.create({
      staff: staffId,
      manufactor: manufactorId,
      ...req.body,
    }).then((data) => data.toJSON());

    return res.status(200).json({
      data: {
        inwardNoteId: newInwardNote._id,
      },
      message: "Add new Inward Note successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const editInwardNote = async (req, res) => {
  try {
    const inwardNoteID = req.params.id;
    const { staffId, manufactorId, goods } = req.body;

    const existedInwardNote = await InwardNote.findById(inwardNoteID);
    if (!existedInwardNote) {
      handleError(res, new CustomError("Inward Note not found", 404));
      return;
    }
    const existedStaff = await Staff.findOne({
      user: new mongoose.Types.ObjectId(staffId),
    });
    if (!existedStaff) {
      handleError(res, new CustomError("Staff not found", 404));
      return;
    }
    const existedManufactor = await Manufactor.findById(manufactorId);
    if (!existedManufactor) {
      handleError(res, new CustomError("Manufactor not found", 404));
      return;
    }
    for (const item of goods) {
      const existedProductInStorage = await Product.findById(item.product);
      if (!existedProductInStorage) {
        handleError(
          res,
          new CustomError(`Product not found with ID ${item.product}`, 404)
        );
        return;
      }
    }

    const previousInwardNoteGoodsData = existedInwardNote.toJSON().goods;

    for (const previousItem of previousInwardNoteGoodsData) {
      const { product, productImportQuantity } = previousItem;
      await Product.findOneAndUpdate(
        { _id: product },
        { $inc: { productQuantity: -productImportQuantity } },
        { new: true }
      );
    }

    for (const item of goods) {
      const { product, productImportQuantity } = item;
      await Product.findOneAndUpdate(
        { _id: product },
        { $inc: { productQuantity: +productImportQuantity } },
        { new: true }
      );
    }

    const updateResult = await InwardNote.updateOne(
      {
        _id: new mongoose.Types.ObjectId(inwardNoteID),
      },
      {
        staff: staffId,
        manufactor: manufactorId,
        ...req.body,
      }
    );
    return res.status(200).json({
      message: "Inward Note updated successfully",
      detail: updateResult,
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const getInwardNoteById = async (req, res) => {
  try {
    const inwardNoteId = req.params.id;
    const existedInwardNote = await InwardNote.findById(inwardNoteId);
    if (!existedInwardNote) {
      handleError(res, new CustomError("InwardNote not found", 404));
      return;
    }
    const inwardNoteData = existedInwardNote.toJSON();

    const goodsData = inwardNoteData.goods;
    for (const item of goodsData) {
      const retrivedProductData = await Product.findById(item.product).then(
        (data) => data.toJSON()
      );
      item.productName = retrivedProductData.productName;
    }
    return res.status(200).json({
      data: {
        ...inwardNoteData,
      },
      message: "Get InwardNote data successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const getAllInwardNotes = async (req, res) => {
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
    const inwardNoteList = await InwardNote.find(filter, "", {
      skip: offset,
      limit: pageSize,
    }).lean();
    console.log(typeof inwardNoteList)
    for (const note of inwardNoteList) {
      const goodsData = note.goods;
      for (const item of goodsData) {
        const retrivedProductData = await Product.findById(item.product).then(
          (data) => data.toJSON()
        );
        item.productName = retrivedProductData.productName;
        console.log(item)
      }
    }
    const totalRows = inwardNoteList.length;
    return res.status(200).json({
      data: inwardNoteList,
      totalRows,
      message: "Get all Inward Notes data successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};

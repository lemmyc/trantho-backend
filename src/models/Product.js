import mongoose from "mongoose";
import {setupSoftDelete} from "../db/utils.js"
const productSchema = new mongoose.Schema(
    {
        productName:{
            type: String,
            required: true
        },
        brand:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
			ref: "Brand",
        },
        productDesc:{
            type: String
        },
        productImageUrl:{
            type: String
        },
        productPrice:{
            type: Number,
            required: true
        },
        productQuantity:{
            type: Number,
            required: true
        },
        warrantyPeriod:{
            type: Number,
            required: true
        },
        discountPercent:{
            type: Number,
            required: false,
            default: 0
        },
        discountStartDate:{
            type: Date,
            required: false
        },
        discountEndDate:{
            type: Date,
            required: false
        },
        isDeleted:{
            type: Boolean,
            default: false
        },
    },
	{
		timestamps: true,
	},
);
setupSoftDelete(productSchema)
export default mongoose.model("Product", productSchema);
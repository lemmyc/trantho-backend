import mongoose from "mongoose";
import { ORDER_STATUS } from "../config/constants.js";
const orderSchema = new mongoose.Schema(
    {
        customer:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
			ref: "Customer",
        },
        orderDate:{
            type: Date,
            required: true
        },
        orderGoods:[
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                productOrderQuantity:{
                    type: Number,
                    required: true
                },
                productOrderOriginalPrice:{
                    type: Number,
                    required: true
                },
                productOrderDiscountedPrice:{
                    type: Number
                }
            }
        ],
        orderTotalPrice:{
            type: Number
        },
        orderNote:{
            type: String
        },
        orderDeliveryAddress:{
            type: String,
            required: true
        },
        orderStatus:{
            type: String,
            default: ORDER_STATUS.PROCESSING
        },
        orderPaymentMethod:{
            type: String,
            required: true
        },
        isPaid:{
            type: Boolean,
            default: false
        },
    },
	{
		timestamps: true,
	},
);
export default mongoose.model("Order", orderSchema);
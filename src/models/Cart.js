import mongoose from "mongoose";
const cartSchema = new mongoose.Schema(
    {
        customer:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
			ref: "Customer",
        },
        cartItems:[
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                productCartQuantity:{
                    type: Number,
                    required: true
                }
            }
        ]
    },
	{
		timestamps: true,
	},
);
export default mongoose.model("Cart", cartSchema);
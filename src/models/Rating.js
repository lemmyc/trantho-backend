import mongoose from "mongoose";
const ratingSchema = new mongoose.Schema(
    {
        customer:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
			ref: "Customer",
        },
        order:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
			ref: "Order",
        },
        product:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
			ref: "Product",
        },
        ratingDate:{
            type: Date,
            required: true
        },
        ratingComment:{
            type: String,
        },
        ratingStars:{
            type: Number,
            required: true
        }
    },
	{
		timestamps: true,
	},
);

export default mongoose.model("Rating", ratingSchema);
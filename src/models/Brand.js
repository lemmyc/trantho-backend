import mongoose from "mongoose";
const brandSchema = new mongoose.Schema(
    {
        brandName:{
            type: String,
            required: true
        },
        brandDesc:{
            type: String
        }
    },
	{
		timestamps: true,
	},
);

export default mongoose.model("Brand", brandSchema);
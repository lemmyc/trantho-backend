import mongoose from "mongoose";
const inwardNoteSchema = new mongoose.Schema(
    {
        staff:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
			ref: "Staff",
        },
        manufactor:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
			ref: "Manufactor",
        },
        inwardNoteDate:{
            type: Date,
            required: true
        },
        goods:[
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                productImportQuantity:{
                    type: Number,
                    required: true
                },
                productImportPrice:{
                    type: String,
                    required: true
                }
            }
        ]
    },
	{
		timestamps: true,
	},
);
export default mongoose.model("InwardNote", inwardNoteSchema);
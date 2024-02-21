import mongoose from "mongoose";
const manufactorSchema = new mongoose.Schema(
    {
        
        manufactorName:{
            type: String,
            required: true
        },
        manufactorPhoneNumber:{
            type: String,
            required: true
        },
        manufactorEmail:{
            type: String,
            required: true
        },
        manufactorAddress:{
            type: String,
            required: true
        }
    },
	{
		timestamps: true,
	},
);

export default mongoose.model("Manufactor", manufactorSchema);

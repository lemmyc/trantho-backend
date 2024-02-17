import mongoose from "mongoose";
const staffSchema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
			ref: "User",
        },
        email:{
            type: String,
            required: true
        },
        fullName:{
            type: String,
            required: true
        },
        dob:{
            type: Date,
            required: true
        },
        address:{
            type: String,
            required: true
        },
        phoneNumber:{
            type: String,
            required: true
        },
    },
	{
		timestamps: true,
	},
);

export default mongoose.model("Staff", staffSchema);

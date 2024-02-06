import mongoose from "mongoose";
import { ROLES } from "../config/constants.js";
const userSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            required: true
        },
        password:{
            type: String,
            required: true
        },
        role:{
            type: String,
            default: ROLES.USER,
            required: true
        },
    },
	{
		timestamps: true,
	},
);

export default mongoose.model("User", userSchema);
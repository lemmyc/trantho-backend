import { CustomError, handleError } from "../utils/Error.js";
import PasswordUtils from "../utils/password-utils.js";
import User from "../models/User.js";
import tokenUtils from "../utils/token-utils.js";
export const signUpUser =  async (req, res)=>{
    const { username, password, ...rest } = req.body;
    const availableUser = await User.findOne({
        username
    })
    if (availableUser){
        handleError(res, new CustomError("Username Existed", 409));
        return;
    }
    const hashedPassword = await PasswordUtils.hash(password);


    const newUser = await User.create({
        username,
        password: hashedPassword
    }).then((data) => data.toJSON());
    const accessToken = tokenUtils.generateAccessToken(newUser);
    const refreshToken = tokenUtils.generateRefreshToken(newUser);
    delete newUser.password;
    delete newUser.deletedAt;
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        secure: process.env.ENVIRONMENT === "PRO" ? true : false,
    });

    return res.status(200).json({
        data: {
          ...newUser,
          accessToken,
        },
        message: "Register successfully",
        status: 200,
    });
}

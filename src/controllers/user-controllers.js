import { CustomError, handleError } from "../utils/Error.js";
import { ROLES } from "../config/constants.js";
import PasswordUtils from "../utils/password-utils.js";
import User from "../models/User.js";
import TokenUtils from "../utils/token-utils.js";
export const signUpUser = async (req, res) => {
  try {
    const { username, password, ...rest } = req.body;
    const availableUser = await User.findOne({
      username,
    });
    if (availableUser) {
      handleError(res, new CustomError("Username Existed", 409));
      return;
    }
    const hashedPassword = await PasswordUtils.hash(password);

    const newUser = await User.create({
      username,
      password: hashedPassword,
    }).then((data) => data.toJSON());
    const accessToken = TokenUtils.generateAccessToken(newUser);
    const refreshToken = TokenUtils.generateRefreshToken(newUser);
    delete newUser.password;
    delete newUser.deletedAt;
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      secure: process.env.ENVIRONMENT === "PRODUCTION" ? true : false,
    });

    return res.status(200).json({
      data: {
        ...newUser,
        accessToken,
      },
      message: "Register successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const logInUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existedUser = await User.findOne({
        username
    });
    if (!existedUser) {
      handleError(res, new CustomError(`Username ${username} not Found`, 404));
      return;
    }
    const userData = existedUser.toJSON();
    const isValidPassword = await PasswordUtils.compare(
      password,
      userData.password
    );
    if (!isValidPassword){
      handleError(res, new CustomError(`Wrong password`, 401));
      return;
    }
    const accessToken = TokenUtils.generateAccessToken(userData);
    const refreshToken = TokenUtils.generateRefreshToken(userData);
    delete userData.password;
    delete userData.deletedAt;
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      secure: process.env.ENVIRONMENT === "PRODUCTION" ? true : false,
    });

    return res.status(200).json({
      data: {
        ...userData,
        accessToken,
      },
      message: "Login successfully",
      status: 200,
    });
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const logOutUser = async (req, res) => {
    try {
      res.clearCookie("refreshToken",{
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        secure: process.env.ENVIRONMENT === "PRODUCTION" ? true : false,
      });
  
      return res.status(200).json({
        message: "Logout successfully",
        status: 200,
      });
    } catch (error) {
      handleError(res, error);
      return;
    }
  };
export const validateUserRole = async (req, res) => {
  try {
    const { authorization, role } = req.headers;
    if (!authorization || authorization === "Bearer") {
      handleError(res, new CustomError("Token not found", 400));
      return;
    }
    const token = authorization.substring(7);
    switch (role) {
      case ROLES.ADMIN:
        const adminUser = TokenUtils.decodeToken(token);

        if (adminUser.role !== ROLES.ADMIN) {
          handleError(res, new CustomError("Permission denied", 401));
          return;
        }
        if (adminUser.role === ROLES.USER) {
          handleError(
            res,
            new CustomError("You do not have permission to do this", 403)
          );
          return;
        }
        return res.status(200).json({
          data: {},
          message: "Token is valid",
          status: 200,
        });
      case ROLES.USER:
        const user = TokenUtils.decodeToken(token);
        if (user.role !== ROLES.USER && user.role !== ROLES.ADMIN) {
          handleError(res, new CustomError("Permission denied", 401));
          return;
        }
        return res.status(200).json({
          data: {},
          message: "Token is valid",
          status: 200,
        });
      default:
        return res.status(400).json({
          data: {},
          message: "Unknown Role",
          status: 400,
        });
    }
  } catch (error) {
    handleError(res, error);
    return;
  }
};
export const requestRefreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        // const { refreshToken } = req.body;
        const refreshTokenInfo = TokenUtils.decodeRefreshToken(refreshToken);
        const user = await User.findById(refreshTokenInfo.userId).then((data) => data.toJSON());
        
        if (!user) {
            handleError(res, new CustomError(`Can not get user from token`, 400));
            return;
        }
        const accessToken = TokenUtils.generateAccessToken(user);
        return res.status(200).json({
            data: {
              accessToken,
            },
            message: "Refresh token succeeded",
            status: 200,
        });
    } catch (error) {
      handleError(res, error);
      return;
    }
};
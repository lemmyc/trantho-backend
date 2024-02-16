import jwt from "jsonwebtoken";
import { CustomError, handleError } from "./Error.js";
import config from "../config/index.js";

class TokenUtils {
  accessKey = config.security.accessKey;
  refreshKey = config.security.refreshKey;

  generateAccessToken(user) {
    return jwt.sign(user, this.accessKey, {
      expiresIn: "15m",
      algorithm: "HS256",
    });
  }
  generateRefreshToken(user) {
    return jwt.sign({ userId: user._id.toString() }, this.refreshKey, {
      expiresIn: "7d",
      algorithm: "HS256",
    });
  }
  decodeToken(token) {
    try {
      return jwt.verify(token, this.accessKey);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new CustomError("Token expired", 401);
      } else {
        throw new CustomError("Error while decoding access token", 401);
      }
    }
  }
  decodeRefreshToken(token) {
    try {
      return jwt.verify(token, this.refreshKey);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new CustomError("Token expired", 401);
      } else {
        throw new CustomError("Error while decoding refresh token", 401);
      }
    }
  }
}

export default new TokenUtils();

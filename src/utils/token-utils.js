import jwt from "jsonwebtoken";
import { CustomError, handleError } from "./Error.js";
import config from "../config/index.js";

class TokenUtils{
    accessKey = config.security.accessKey;
    refreshKey = config.security.refreshKey;

    generateAccessToken(user) {
        return jwt.sign(user, this.accessKey, {
            expiresIn: "15m",
            algorithm: "HS256",
        });
    };
    generateRefreshToken(user) {
        return jwt.sign({ id: user.id }, this.refreshKey, {
          expiresIn: "1d",
          algorithm: "HS256",
        });
    }
    decodeToken(token) {
        try {
          jwt.verify(token, this.accessKey);
          return jwt.decode(token, this.accessKey);
        } catch (error) {
          throw new CustomError("Invalid Token", 401);
        }
    }
    decodeRefreshToken(token) {
        try {
          jwt.verify(token, this.refreshKey);
          return jwt.decode(token, this.refreshKey);
        } catch (error) {
          console.log(error);
          throw new CustomError("Invalid Refesh Token", 401);
        }
    }
}

export default new TokenUtils();

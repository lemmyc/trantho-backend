import { config as dotenv_config }  from "dotenv";

dotenv_config();

export default {
    development: {
        database: process.env.DATABASE || "TRANTHO_DATABASE",
        port: process.env.port || 5000,
        jwt_secret: process.env.JWT_SECRET || "TRANTHO_JWT",
    },
    security: {
        accessKey: process.env.ACCESS_TOKEN_KEY,
        refreshKey: process.env.REFRESH_TOKEN_KEY,
    },
}
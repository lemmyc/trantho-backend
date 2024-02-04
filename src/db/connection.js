import { connect, disconnect } from "mongoose";
import config from "../config/index.js";


async function connectToDatabase(){
    try {
        await connect(config.development.database)
    } catch (error) {
        console.log(error)
        throw new Error("Error while connecting to MongoDB")
    }
}

async function disconnectToDatabase() {
    try {
        await disconnect();
    } catch (error) {
        throw new Error("Error while disconnecting from MongoDB ")
    }
}

export { connectToDatabase, disconnectToDatabase  }
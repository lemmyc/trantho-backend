import app from "./app.js";
import { connectToDatabase } from "./src/db/connection.js";

import config from "./src/config/index.js";



connectToDatabase()
  .then(()=>{
    app.listen(config.development.port, ()=>{
      console.log("Connected to MongoDB");
      console.log("Server is running on port 5000");
    })
  })
  .catch((error)=>{
    console.error(error)
  })

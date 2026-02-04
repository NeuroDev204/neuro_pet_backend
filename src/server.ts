import dotenv from "dotenv";
dotenv.config();

import "./types";
import { app } from "./app";
import { connectMongo, validateEnv, env } from "./config";


(async () => {
  try {

    validateEnv();

    await connectMongo();
    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();

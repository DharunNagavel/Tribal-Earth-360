import { config } from "dotenv";

config({ path: ".env" });

export const {PORT,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    MONGODB_URI} = process.env;

import express from "express";
import router from "./src/routes/index.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

const app = express();
const { PORT, DB_URL } = process.env;

app.use(express.json());
mongoose.connect(DB_URL).then(() => {
  console.log("Connection successful");
});
app.use(cors());
app.use("/", router);

app.listen(PORT, () => {
  console.log("Server is running!");
});

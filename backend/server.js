import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/connectDB.js";
import authRoute from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
	res.send("K.O.");
});

app.use("/api/auth", authRoute);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

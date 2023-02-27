import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/connectDB.js";
import errorHandler from "./middleware/errorHandler.js";
import authRoute from "./routes/auth.js";
import protectedRoute from "./routes/protected.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
	res.send("K.O.");
});

app.use("/api/auth", authRoute);

app.use("/api/protected", protectedRoute);

// Error Handler middleware
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ErrorResponse from "../utils/ErrorResponse.js";

const verifyJWT = (req, res, next) => {
	let token;
	if (
		req.headers?.authorization &&
		req.headers.authorization.startsWith("Bearer")
	)
		token = req.headers.authorization.split(" ")[1];

	if (!token) return next(new ErrorResponse("Not authorized!", 401));

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = User.findById(decoded.id);

		if (!user) return next(new ErrorResponse("Not a valid user.", 404));
		console.log(user);

		req.user = user;

		next();
	} catch (error) {
		return next(new ErrorResponse("Authorization failed", 401));
	}
};

export default verifyJWT;

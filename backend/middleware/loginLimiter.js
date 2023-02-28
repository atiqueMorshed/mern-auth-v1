import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 5,
	// eslint-disable-next-line no-unused-vars
	message: async (req, res) => "You can only make 5 requests every minute.",
	handler: (request, response, next, options) =>
		response
			.status(options.statusCode)
			.json({ success: false, message: "Too many requests!" }),
	standardHeaders: true,
	legacyHeaders: false,
});

export default loginLimiter;

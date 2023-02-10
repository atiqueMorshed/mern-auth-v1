import User from "../models/User.js";

export const register = async (req, res) => {
	const { username, email, password } = req.body;
	console.log({ username, email, password });
	try {
		const user = await User.create({
			username,
			email,
			password,
		});
		res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};

export const login = (req, res) => {
	res.send("Login route.");
};

export const resetPassword = (req, res) => {
	const { resetToken } = req.params;
	res.send(`Reset password route. ${resetToken}`);
};

export const forgotPassword = (req, res) => {
	res.send("Forgot password route.");
};

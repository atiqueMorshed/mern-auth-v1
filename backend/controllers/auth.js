import crypto from "crypto";
import User from "../models/User.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import { transporter } from "../utils/sendEmail.js";
import sendToken from "../utils/sendToken.js";
export const register = async (req, res, next) => {
	const { username, email, password } = req.body;

	if (!username || !email || !password)
		return next(new ErrorResponse("Please fill in the required fields.", 400));

	try {
		const user = await User.create({
			username,
			email,
			password,
		});
		sendToken(res, user, 200);
	} catch (error) {
		next(error);
	}
};

export const login = async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password)
		return next(new ErrorResponse("Email and password is required.", 400));

	try {
		const user = await User.findOne({ email }).select("+password");

		if (!user) return next(new ErrorResponse("No user found.", 401));

		const isMatch = await user.matchPasswords(password);

		if (!isMatch) return next(new ErrorResponse("Invalid password.", 401));

		sendToken(res, user, 201);
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

export const resetPassword = async (req, res, next) => {
	const { resetToken } = req.params;
	const { password } = req.body;
	if (!resetToken) {
		return next(new ErrorResponse("Invalid request.", 404));
	}

	if (!password) {
		return next(new ErrorResponse("Invalid new password.", 404));
	}

	const resetTokenHashed = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");
	try {
		const user = await User.findOne({
			"resetPasswordToken.resetToken": resetTokenHashed,
		}).select("+password");

		if (!user) {
			return next(
				new ErrorResponse(
					"Bad link, try copying the reset password link from email and try again.",
					401,
				),
			);
		}

		if (user.resetPasswordToken.expiryDate < new Date()) {
			return next(new ErrorResponse("Reset password link expired.", 406));
		}

		user.password = password;
		user.resetPasswordToken = undefined;

		await user.save();

		res.status(201).json({
			success: true,
			data: "Password Updated Success",
			token: user.getSignedJWTToken(),
		});
	} catch (error) {
		next(error);
	}
};

export const forgotPassword = async (req, res, next) => {
	const { email } = req.body;

	if (!email) return next(new ErrorResponse("Invalid request.", 404));

	try {
		const user = await User.findOne({ email: email });
		if (!user)
			return next(new ErrorResponse("Please enter a valid email.", 404));

		const resetToken = user.getResetPasswordToken();

		await user.save();

		const resetUrl = `${process.env.FRONTEND_BASEURL}/resetpassword/${resetToken}`;
		const htmlContent = `
			<h1>Reset password confirmation</h1>
			<p>A reset password request was made for this email on our website. Please follow the link to reset your password.</p>
			<a href=${resetUrl} clicktracking=off>${resetUrl}</a>
			<br/>
			<p>Please ignore the email if you did not make the request.</p>
		`;

		const mailOptions = {
			from: process.env.MAILTRAP_FROM,
			to: email,
			subject: "MERN Auth V1: Reset password.",
			html: htmlContent,
		};

		// eslint-disable-next-line no-unused-vars
		transporter.sendMail(mailOptions, async function (err, info) {
			if (err) {
				user.resetPasswordToken.resetToken = "";
				user.resetPasswordToken.expiryDate = undefined;

				await user.save();
				return next(new ErrorResponse("Email could not be sent", 500));
			} else {
				return res.status(200).json({
					message: "success",
				});
			}
		});

		// SendGrid
		// try {
		// 	await sendEmail({
		// 		to: email,
		// 		subject: "MERN Auth V1: Reset password.",
		// 		htmlContent,
		// 	});
		// } catch (error) {
		// 	user.resetPasswordToken.resetToken = "";
		// 	user.resetPasswordToken.expiryDate = undefined;

		// 	await user.save();

		// 	return next(new ErrorResponse("Email could not be sent", 500));
		// }
		// res.status(200).json({
		// 	message: "success",
		// });
	} catch (error) {
		next(error);
	}
};

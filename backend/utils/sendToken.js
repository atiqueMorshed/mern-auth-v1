const sendToken = (res, user, statusCode) => {
	const token = user.getSignedJWTToken();
	res.status(statusCode).json({ success: true, token });
};

export default sendToken;

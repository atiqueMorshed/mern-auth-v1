export const protectedContent = (req, res) => {
	res.status(200).json({ success: true, data: "This is protected content." });
};

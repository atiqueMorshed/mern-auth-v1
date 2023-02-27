import nodemailer from "nodemailer";

// MailTrap
export const transporter = nodemailer.createTransport({
	host: "sandbox.smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: process.env.MAILTRAP_USER,
		pass: process.env.MAILTRAP_PASS,
	},
});

// const sendEmail = async ({ to, subject, htmlContent }) => {
// SendGrid
// const transporter = nodemailer.createTransport(
// 	nodemailerSendgrid({
// 		apiKey: process.env.SENDGRID_EMAIL_PASSWORD,
// 	}),
// );
// const mailOptions = {
// 	from: process.env.SENDGRID_VERIFIED_SENDER,
// 	to,
// 	subject,
// 	text: "MERN Auth V1: Reset password.",
// 	html: htmlContent,
// };
// transporter.sendMail(mailOptions, function (err, info) {
// 	if (err) {
// 		console.log(err);
// 	} else {
// 		console.log("SUCCESS!!");
// 		console.log(info);
// 	}
// });
// };

// export default sendEmail;

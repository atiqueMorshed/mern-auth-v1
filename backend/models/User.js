import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
	username: {
		type: String,
		required: [true, "Username is required."],
		unique: [true, "Username already in use."],
		minLength: [6, "Must be atleast 6 characters."],
		maxLength: [12, "Cannot be larger than 6 characters."],
		match: [/^[A-Za-z0-9]{6,12}$/, "Only alphabets and numbers."],
	},
	email: {
		type: String,
		required: [true, "Email is required."],
		unique: [true, "Email already in use."],
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			"Only alphabets and numbers.",
		],
	},
	password: {
		type: String,
		required: [true, "Password is required"],
		minLength: [6, "Must be atleast 6 characters."],
		maxLength: [20, "Cannot be larger than 20 characters."],
		select: false,
	},
	resetPasswordToken: {
		isActive: {
			type: Boolean,
		},
		resetToken: {
			type: String,
		},
		expiryDate: {
			type: Date,
		},
	},
	isEmailVerified: {
		type: Boolean,
	},
	emailVerificationToken: {
		verificationToken: {
			type: String,
		},
		expiryDate: {
			type: Date,
		},
	},
});
// Here, we are using the function keyword because that will bind the this keyword to the new user object that it receives.
UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});
const User = mongoose.model("User", UserSchema);

export default User;

const { UserInputError } = require("apollo-server-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");
const {
	validateRegisterInput,
	validateLoginInput,
} = require("../../utils/validators");

function generateToken(user) {
	const token = jwt.sign(
		{
			id: user.id,
			email: user.email,
			username: user.username,
		},
		SECRET_KEY,
		{ expiresIn: "1h" }
	);
	return token;
}

module.exports = {
	Mutation: {
		async login(_, { username, password }) {
			const { errors, valid } = validateLoginInput(username, password);
			if (!valid) {
				throw new UserInputError("Input Error", { errors });
			}

			const user = await User.findOne({ username });
			if (!user) {
				errors.general = "User not found";
				throw new UserInputError("Wrong Credentials", { errors });
			}

			const match = await bcrypt.compare(password, user.password);
			if (!match) {
				errors.general = "Wrong Password";
				throw new UserInputError("Wrong Credentials", { errors });
			}

			const token = generateToken(user);
			return {
				...user._doc,
				id: user._id,
				token,
			};
		},
		async register(
			_,
			{ registerInput: { username, email, password, confirmPassword } }
		) {
			//validate register inputs
			const { errors, valid } = validateRegisterInput(
				username,
				email,
				password,
				confirmPassword
			);
			if (!valid) {
				throw new UserInputError("Input Error", { errors });
			}
			const usernameUser = await User.findOne({ username });
			const emailUser = await User.findOne({ email });
			if (usernameUser || emailUser) {
				if (usernameUser) {
					errors.username = "Username is taken";
				}
				if (emailUser) {
					errors.email = "Email is associated with an account";
				}
				throw new UserInputError("Input Error", { errors });
			}
			//hashing the password before storing
			password = await bcrypt.hash(password, 12);

			const newUser = new User({
				email,
				username,
				password,
				createdAt: new Date().toISOString(),
			});
			const res = await newUser.save();

			const token = generateToken(res);
			return {
				...res._doc,
				id: res._id,
				token,
			};
		},
	},
};

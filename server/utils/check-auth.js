const { AuthenticationError } = require("apollo-server-errors");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

module.exports = (context) => {
	console.log("🚀 ~ file: check-auth.js ~ line 6 ~ context", context);
	const authHeader = context.req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split("Bearer ")[1];
		if (token) {
			try {
				const user = jwt.verify(token, SECRET_KEY);
				return user;
			} catch (error) {
				throw new AuthenticationError("Invalid/Expired Token");
			}
		}
		throw new Error("Authentication token must be 'Bearer [token]'");
	}
	throw new Error("Autherization header must be provided");
};

module.exports.validateRegisterInput = (
	username,
	email,
	password,
	confirmPassword
) => {
	const errors = {};

	if (username.trim() === "") {
		errors.username = "Username should not be empty";
	}
	if (email.trim() === "") {
		errors.email = "Email should not be empty";
	} else {
		const regex =
			/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
		if (!email.match(regex)) {
			errors.email = "Invalid Email Address";
		}
	}
	if (password === "") {
		errors.password = "Password must not be empty";
	} else if (password !== confirmPassword) {
		errors.confirmPassword = "Passwords should match";
	}

	return {
		errors,
		valid: Object.keys(errors).length < 1,
	};
};

module.exports.validateLoginInput = (username, password) => {
	const errors = {};
	if (username.trim() === "") {
		errors.username = "Username must not be empty";
	}
	if (password === "") {
		errors.password = "Password must not be empty";
	}
	return {
		errors,
		valid: Object.keys(errors).length < 1,
	};
};

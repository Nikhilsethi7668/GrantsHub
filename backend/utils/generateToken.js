import jwt from "jsonwebtoken";

export const generateTokenAndCookie = (res, userId) => {
	const token = jwt.sign({ userId }, process.env.JWT_TOKEN, {
		expiresIn: "7d",
	});

	// ✅ Corrected `token` instead of `accessToken`
	res.cookie("token", token, {
		httpOnly: true, // Prevents XSS attacks
		secure: true, // Secure cookies in production
		sameSite: "None", // Needed for cross-site cookies
	});

	return token;
};

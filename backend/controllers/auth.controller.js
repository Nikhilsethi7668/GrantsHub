import { User } from "../models/auth.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateTokenAndCookie } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../mailtrap/email.js";
import { sendWelcomeEmail } from "../mailtrap/email.js";
import { sendPasswordResetEmail } from "../mailtrap/email.js";
import { sendResetSuccessEmail } from "../mailtrap/email.js";

export const verifyToken = async (req, res) => {
  const token = req.cookies.token;
  // console.log(token);
  if (!token) {
    return res
      .status(401)
      .json({ success: false, messsage: "No Token Provided" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_TOKEN);
    const user = await User.findById(decode.userId);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      authenticated: true,
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
// export const signup = async (req, res) => {
//   const { firstName, lastName, email, password, confirmPassword } = req.body;

//   try {
//     if (!firstName || !lastName || !email || !password || !confirmPassword) {
//       console.log(firstName);
//       throw new Error("All fields are required");
//     }

//     const userAlreadyExists = await User.findOne({ email });

//     if (userAlreadyExists) {
//       return res
//         .status(400)
//         .json({ success: false, message: "User already exists" });
//     }

//     if (password !== confirmPassword) {
//       throw new Error("Passwords do not match.");
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const verificationToken = Math.floor(
//       100000 + Math.random() * 900000
//     ).toString();

//     const user = new User({
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword,
//       confirmPassword: hashedPassword,
//       verificationToken,
//       verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
//     });

//     await user.save();

//     // Ensure the function is defined to handle token and cookie generation
//     // generateTokenAndCookie(res, user._id);

//     // Ensure the function is defined for sending verification email
//     await sendVerificationEmail(user.email, verificationToken);

//     res.status(201).json({
//       success: true,
//       message: "User created successfully",
//       user: {
//         ...user._doc,
//         password: undefined,
//         confirmPassword: undefined,
//       },
//     });
//   } catch (error) {
//     console.log(error.message);
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// export const verifyemail = async (req, res) => {
//   const { code } = req.body;

//   try {
//     const user = await User.findOne({
//       verificationToken: code,
//       verificationTokenExpiresAt: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid or experied verification code",
//       });
//     }

//     user.isVerified = true;
//     user.verificationToken = undefined;
//     user.verificationTokenExpiresAt = undefined;
//     await user.save();
//     generateTokenAndCookie(res, user._id);

//     await sendWelcomeEmail(user.email, user.firstName);

//     res.status(200).json({
//       success: true,
//       message: "Email verified Successfully ",
//       user: {
//         ...user._doc,
//         password: undefined,
//       },
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: `Failed to verify the  Email Account : ${error}`,
//     });
//   }
// };

export const signup = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } =await req.body;
  console.log(firstName," ",lastName," ",email," ");
  

  try {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
    }

    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
      
      return res
        .status(400)
        .json({ success: false, message: "User already exists Please Login" });
    }

    if (password !== confirmPassword) {
      return res
      .status(400)
      .json({ success: false, message: "Passwords do not match." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    await user.save();

    // ✅ Ensure no cookies are set during signup
    res.clearCookie("token");

    // ✅ Send verification email
    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully. Please verify your email.",
      user: {
        ...user._doc,
        password: undefined,
        confirmPassword: undefined,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyemail = async (req, res) => {
  const { code } =await req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    // ✅ Generate token & set cookie after email verification
    generateTokenAndCookie(res, user._id);

    await sendWelcomeEmail(user.email, user.firstName);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Failed to verify the Email Account: ${error}`,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    // 1. Find user by email (case-insensitive, trimmed)
    const user = await User.findOne({ email: email.trim().toLowerCase() })
      .select('+password +isVerified +verificationToken +verificationTokenExpiresAt')
      .lean();

    if (!user) {
      return res.status(401).json({ // 401 for unauthorized
        success: false,
        message: "Invalid credentials", // Generic message for security
      });
    }

    // 2. Validate password (timing-safe comparison)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 3. Check if user is verified
    if (!user.isVerified) {
      // Generate new verification token
      const verificationToken = crypto.randomBytes(32).toString('hex'); // More secure than Math.random()
      const verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

      // Update user (optimized to only update necessary fields)
      await User.updateOne(
        { _id: user._id },
        { 
          verificationToken,
          verificationTokenExpiresAt,
          lastLoginAttempt: new Date() // Track login attempts
        }
      );

      // Send verification email (fire-and-forget)
      sendVerificationEmail(user.email, verificationToken)
        .catch(err => console.error("Email sending error:", err));

      return res.status(403).json({ // 403 for forbidden
        success: false,
        message: "Account not verified. A new verification link has been sent.",
        reverify: true,
      });
    }

    // 4. Generate token and set cookie
    const token = generateTokenAndCookie(res, user._id);

    // Update last login (optimized update)
    await User.updateOne(
      { _id: user._id },
      { 
        lastLogin: new Date(),
        loginAttempts: 0 // Reset on successful login
      }
    );

    // Prepare user data for response (exclude sensitive fields)
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
      // Add other non-sensitive fields as needed
    };

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: userData,
      token // Include token in response if needed for mobile
    });

  } catch (error) {
    console.error("Login error:", error);
    
    // Log more details for server errors
    if (!error.statusCode || error.statusCode === 500) {
      console.error('Detailed error:', {
        email,
        timestamp: new Date(),
        stack: error.stack
      });
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "An error occurred during login",
    });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged-Out Successfully",
  });
};

export const forgotPassword = async (req, res) => {
  const { email } =await req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not Found !!!",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hrs

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password Reset Link Send ton your email",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `error in sending email : ${error}`,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    console.log(token);
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // update password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    user.save();

    await sendResetSuccessEmail(user.email);

    res.status(200).json({
      success: true,
      message: "Reset Successful Email send Successfully!!!",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find({});

    // Filter users whose isVerified property is true
    const allUsers = users.filter((user) => user.isVerified === true);

    // Send the response with the filtered users
    res.status(200).json({
      success: true,
      message: "Verified users fetched successfully",
      allUsers: allUsers,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching users",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by ID and delete it
    const user = await User.findByIdAndDelete(id);

    // If no user is found, return a 404 error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return a success response
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    // Handle any errors that occur during the deletion process
    console.error(error);
    res.status(500).json({ message: "Something went wrong, please try again" });
  }
};

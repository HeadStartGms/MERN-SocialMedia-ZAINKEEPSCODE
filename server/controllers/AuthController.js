import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Helper function to generate a JWT token
const generateToken = (user) => {
  return jwt.sign(
    { username: user.username, id: user._id },
    process.env.JWT_SECRET, // Ensure JWT_SECRET is set in your environment
    { expiresIn: "1h" }
  );
};

// Register new user
export const registerUser = async (req, res) => {
  const { firstname, lastname, username, email, password, confirmpass } = req.body;

  const requiredFields = {
    firstname: "First name",
    lastname: "Last name",
    username: "Username",
    email: "Email",
    password: "Password",
    confirmpass: "Password confirmation"
  };

  // Validate required fields against your schema
  const missingFields = Object.entries(requiredFields)
    .filter(([key]) => !req.body[key])
    .map(([_, name]) => name);

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(', ')}`
    });
  }

  // Password confirmation check
  if (password !== confirmpass) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    // Check for existing username or email
    const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        error: existingUser.username === username
          ? "Username already exists"
          : "Email already exists"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user according to your schema
    const newUser = new UserModel({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
      // Default values for optional fields
      profilePicture: "",
      coverPicture: "",
      followers: [],
      following: []
    });

    const savedUser = await newUser.save();

    // Generate token
    const token = jwt.sign(
      { id: savedUser._id, isAdmin: savedUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Remove password before sending response
    const { password: _, ...userWithoutPassword } = savedUser.toObject();

    res.status(201).json({
      message: "Registration successful",
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Validate required fields
  if (!username || !password) {
    return res.status(400).json({
      message: "Both username and password are required",
    });
  }

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials", // Generic message for security purposes
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials", // Generic message for security purposes
      });
    }

    // Remove password before sending response
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      user: userWithoutPassword,
      token,
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Internal server error during login",
    });
  }
};
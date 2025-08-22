import User from "../models/user.model.js";
import TokenBlacklist from "../models/tokenblacklist.model.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { username, email, phone_number, password, role } =
      req.body;

    if (
      !username ||
      !email ||
      !phone_number ||
      !password ||
      !role
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      phone_number,
      password,
      role: "parent"
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        username: newUser.username,
        email: newUser.email,
        phone_number: newUser.phone_number,
        role: newUser.role
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    res.json({ token, pass_key: user.pass_key });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword; //will automatically hash

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(400).json({ message: "No token provided." });
    }
    const token = authHeader.replace("Bearer ", "");
    const blacklistedToken = new TokenBlacklist({ token });
    await blacklistedToken.save();

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).json({ message: "Token already blacklisted." });
    }
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

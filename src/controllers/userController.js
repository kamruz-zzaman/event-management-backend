const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      throw new Error("All field are required!");
    }

    // check exasting user
    const exastingUser = await User.findOne({ email });
    if (exastingUser) {
      return res.status(403).json({
        errorMessage: "User already registered",
      });
    }
    // password hash
    const hashPassowrd = bcrypt.hashSync(password, 12);
    const createUser = {
      email,
      password: hashPassowrd,
      name,
      phone,

      // thumbNail: thumbNail || null,
    };

    const user = await User.create(createUser);

    // write code for getting strong random bytes for token

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    res.status(201).json({
      message: "User created successfully",
      data: {
        accessToken: token,
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          _id: user._id,
          thumbNail: user.thumbNail,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (err) {
    res.status(403).json({
      errorMessage: "There was a problem registering the user",
      error: err.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      throw new Error("Please provide an email");
    }
    if (!password) {
      throw new Error("Please provide a password. Password can not be empty!");
    }
    // check exasting user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    // Check password
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(403).json({
        error: "Invalid password!",
      });
    }
    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    // response
    res.status(200).json({
      message: "Welcome back",
      data: {
        accessToken: token,
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          _id: user._id,
          // thumbNail: user.thumbNail,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (err) {
    res.status(403).json({
      errorMessage: "There was a problem login the user",
      error: err.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};

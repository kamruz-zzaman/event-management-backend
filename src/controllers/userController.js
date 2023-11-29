const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone } = req.body;

    if (!first_name || !last_name || !email || !password || !phone) {
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
      first_name,
      last_name,
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
          first_name: user.first_name,
          last_name: user.last_name,
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
          first_name: user.first_name,
          last_name: user.last_name,
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


// Checking The user is valid or not
const userInfo = async (req, res, next) => {
  try {
    const userId = req?.userId;
    // Define your search criteria
    const query = { _id: userId };
    // Checkng if the user already exist
    const isUser = await User.findOne(query);

    if (isUser) {
      return res.status(200).send({
        user: {
          first_name: isUser.first_name,
          last_name: isUser.last_name,
          email: isUser.email,
          phone: isUser.phone,
          _id: isUser._id,
          // thumbNail: isUser.thumbNail,
          role: isUser.role,
          createdAt: isUser.createdAt,
          updatedAt: isUser.updatedAt,
        },
        message: "valid user",
      });
    } else {
      return res.status(404).send({
        message: "user data isn't available!",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  userInfo
};

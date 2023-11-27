const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    phone: {
      type: String || Number,
      required: true,
    },
    event: {
      type: Array,
      required: false,
      default: []
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;

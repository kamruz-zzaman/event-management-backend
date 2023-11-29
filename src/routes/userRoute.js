const express = require("express");
const { registerUser, loginUser, userInfo } = require("../controllers/userController");
const router = express.Router();
const checkLogin = require("../middleware/checkLogin");


router.get("/userInfo", checkLogin, userInfo);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;

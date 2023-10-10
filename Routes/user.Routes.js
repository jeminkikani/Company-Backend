const express = require("express");
const {
  registerUser,
  loginuser,
  user_info,
  listUser,
  updateuser,
  deleteUser,
  refreshToken,
} = require("../controller/user.controller");
const { IsVerify } = require("../middleware/auth");
const { validationConstant } = require("../constant/validate.constant");
const userRoutes = express.Router();

// register_user
userRoutes.post("/signup", validationConstant("register"), registerUser);

// login_user
userRoutes.post("/login", IsVerify("Admin") ,validationConstant("login"), loginuser);

//refreshToken
userRoutes.post("/refreshToken", refreshToken);

// user_info
userRoutes.get("/userInfo", IsVerify("Admin"), user_info);

//list_user
userRoutes.get("/list", listUser);

// updateuser
userRoutes.put(
  "/updateProfile",
  IsVerify("Admin"),
  validationConstant("update"),
  updateuser
);

//deleteuser
userRoutes.delete("/delete", IsVerify("Admin"), deleteUser);

module.exports = userRoutes;

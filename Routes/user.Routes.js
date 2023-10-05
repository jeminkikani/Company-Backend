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
userRoutes.post("/usersignup", validationConstant("register"), registerUser);

// login_user
userRoutes.post("/loginuser", IsVerify("Admin") ,validationConstant("login"), loginuser);

//refreshToken
userRoutes.post("/refreshtoken", refreshToken);

// user_info
userRoutes.get("/userinfo", IsVerify("Admin"), user_info);

//list_user
userRoutes.get("/listuser", listUser);

// updateuser
userRoutes.put(
  "/updateprofile",
  IsVerify("Admin"),
  validationConstant("update"),
  updateuser
);

//deleteuser
userRoutes.delete("/deleteuser", IsVerify("Admin"), deleteUser);

module.exports = userRoutes;

const express = require("express");
const {
  registerUser,
  loginuser,
  getuser,
  getallUser,
  updateuser,
  deleteUser,
} = require("../controller/user.controller");
const { IsVerify } = require("../middleware/auth");
const { validationConstant } = require("../constant/validate.constant");
const userRoutes = express.Router();

// register-user
userRoutes.post("/new-user", validationConstant("register"), registerUser);

// login-user
userRoutes.post("/login-user", validationConstant("login"), loginuser);

// get user
userRoutes.get("/verify-user", IsVerify("Admin"), getuser);

//get-specific-user
userRoutes.get("/all-user", getallUser);

// updateuser
userRoutes.put(
  "/update-user",
  IsVerify("Admin"),
  validationConstant("update"),
  updateuser
);

//deleteuser
userRoutes.delete("/delete-user", IsVerify("Admin"), deleteUser);

module.exports = userRoutes;

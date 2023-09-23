const express = require("express");
const {
  registerUser,
  loginuser,
  getuser,
  getallUser,
  updateuser,
  deleteUser,
} = require("../controllar/user.controllar");
const { isveryfy } = require("../middlware/auth");
const { validationConstant } = require("../constant/validate.constant");
const userRoutes = express.Router();

// register-user
userRoutes.post("/new-user", validationConstant("register"), registerUser);

// login-user
userRoutes.post("/login-user", validationConstant("login"), loginuser);

// get user
userRoutes.get("/verify-user", isveryfy("Admin"), getuser);

//get-specific-user
userRoutes.get("/all-user", isveryfy("Admin"), getallUser);

// updateuser
userRoutes.put(
  "/update-user",
  isveryfy,
  validationConstant("update"),
  updateuser
);

//deleteuser
userRoutes.delete("/delete-user", isveryfy, deleteUser);

module.exports = userRoutes;

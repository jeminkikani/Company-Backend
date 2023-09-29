const express = require("express");
const { IsVerify } = require("../middleware/auth");
const checkPermissionMiddleware = require("../middleware/check.permission");
const { joinGroup } = require("../controller/groupUser.controller");
const groupUserRoutes = express.Router();

groupUserRoutes.post(
  "/join-group/:id",
  IsVerify("Admin"),
  checkPermissionMiddleware("createGroup"),
  joinGroup
);


module.exports = groupUserRoutes;

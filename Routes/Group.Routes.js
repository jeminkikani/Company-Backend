const express = require("express");
const {
  createGroup,
  viewGroup,
  updateGroup,
  deleteGroup,
  listGroup,
  alldata,
  fetchiddata,
} = require("../controller/Group.controller");
const { IsVerify } = require("../middleware/auth");
const checkPermissionMiddleware = require("../middleware/check.permission");
const groupRoutes = express.Router();

groupRoutes.post(
  "/creategroup",
  IsVerify("Admin"),
  checkPermissionMiddleware("createGroup"),
  createGroup
);

groupRoutes.get(
  "/viewgroup",
  IsVerify("Admin"),
  checkPermissionMiddleware("createGroup"),
  viewGroup
);

groupRoutes.post(
  "/updategroup/:id",
  IsVerify("Admin"),
  checkPermissionMiddleware("createGroup"),
  updateGroup
);

groupRoutes.delete(
  "/deletegroup/:id",
  IsVerify("Admin"),
  checkPermissionMiddleware("createGroup"),
  deleteGroup
);

groupRoutes.get("/listgroup", listGroup);

groupRoutes.get(
  "/userinformation",
  IsVerify("Admin"),
  checkPermissionMiddleware("createGroup"),
  alldata
);

groupRoutes.get(
  "/companyAndGroups",
  IsVerify("Admin"),
  checkPermissionMiddleware("createGroup"),
  fetchiddata
);

module.exports = groupRoutes;

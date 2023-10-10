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
  "/create",
  IsVerify("Admin"),
  checkPermissionMiddleware("createGroup"),
  createGroup
);

groupRoutes.get(
  "/view",
  IsVerify("Admin"),
  checkPermissionMiddleware("createGroup"),
  viewGroup
);

groupRoutes.post(
  "/update/:id",
  IsVerify("Admin"),
  checkPermissionMiddleware("createGroup"),
  updateGroup
);

groupRoutes.delete(
  "/delete/:id",
  IsVerify("Admin"),
  checkPermissionMiddleware("createGroup"),
  deleteGroup
);

groupRoutes.get("/list", listGroup);

groupRoutes.get(
  "/userInformation",
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

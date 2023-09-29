const express = require("express");
const {
  createGroup,
  viewGroup,
  updateGroup,
  deleteGroup,
  listGroup,
  alldata,
  fetchiddata,
  joinGroup,
} = require("../controller/Group.controller");
const { IsVerify } = require("../middleware/auth");
const checkPermissionMiddleware = require("../middleware/check.permission");
const groupRoutes = express.Router();

groupRoutes.post(
  "/create-group",
  IsVerify("Admin"),
  checkPermissionMiddleware("createGroup"),
  createGroup
);

groupRoutes.get(
  "/view-group",
  IsVerify("Admin"),
  checkPermissionMiddleware("createGroup"),
  viewGroup
);

groupRoutes.post(
  "/update-group",
  IsVerify("Admin"),
  checkPermissionMiddleware("createGroup"),
  updateGroup
);

groupRoutes.delete(
  "/delete-group",
  IsVerify("Admin"),
  checkPermissionMiddleware("createGroup"),
  deleteGroup
);

groupRoutes.get("/list-group", listGroup);

groupRoutes.get(
  "/all-data",
  IsVerify("Admin"),
  checkPermissionMiddleware("createGroup"),
  alldata
);

groupRoutes.get(
  "/get-company-id/get-group/:id",
  IsVerify("Admin"),
  checkPermissionMiddleware("createGroup"),
  fetchiddata
);

module.exports = groupRoutes;

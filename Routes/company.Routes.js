const express = require("express");
const { IsVerify } = require("../middleware/auth");
const checkPermissionMiddleware = require("../middleware/check.permission");
const {
  create_company,
  view_company,
  update_company,
  JoinCompany,
} = require("../controller/company.controller");
const companyRoutes = express.Router();

companyRoutes.post(
  "/create",
  IsVerify("Admin"),
  checkPermissionMiddleware("createGroup"),
  create_company
);

companyRoutes.get(
  "/view",
  IsVerify("Admin"),
  checkPermissionMiddleware("createGroup"),
  view_company
);

companyRoutes.put(
  "/update",
  IsVerify("Admin"),
  checkPermissionMiddleware("createGroup"),
  update_company
);

companyRoutes.post(
  "/join/:id",
  IsVerify("Admin"),
  checkPermissionMiddleware("createGroup"),
  JoinCompany
);

// groupRoutes.get("list-group", listGroup);

module.exports = companyRoutes;

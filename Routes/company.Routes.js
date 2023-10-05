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
  "/company/create",
  IsVerify("Admin"),
  checkPermissionMiddleware("createGroup"),
  create_company
);

companyRoutes.get(
  "/company/view",
  IsVerify("Admin"),
  checkPermissionMiddleware("createGroup"),
  view_company
);

companyRoutes.put(
  "/company/update",
  IsVerify("Admin"),
  checkPermissionMiddleware("createGroup"),
  update_company
);

companyRoutes.post(
  "/company/join/:id",
  IsVerify("Admin"),
  checkPermissionMiddleware("createGroup"),
  JoinCompany
);

// groupRoutes.get("list-group", listGroup);

module.exports = companyRoutes;

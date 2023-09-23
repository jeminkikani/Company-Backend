const express = require("express");
const { isveryfy } = require("../middlware/auth");
const checkPermissionMiddleware = require("../middlware/check.permission");
const { create_comapny , view_company, update_company } = require("../controllar/company.controllar");
const companyRoutes = express.Router();

companyRoutes.post("/create-company", isveryfy, checkPermissionMiddleware("createGroup"), create_comapny);

companyRoutes.get("/view-company", isveryfy, checkPermissionMiddleware("createGroup"), view_company);

companyRoutes.put("/update-company", isveryfy, checkPermissionMiddleware("createGroup"), update_company);

// groupRoutes.delete("/view-company-group/:id", isveryfy, checkPermissionMiddleware("createGroup"), deleteGroup);

// groupRoutes.get("list-group", listGroup);

module.exports = companyRoutes;

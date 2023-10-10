const express = require("express");
const { permission, listpermission } = require("../controller/is_permission.controller");

const is_permissionRoutes = express.Router();

is_permissionRoutes.post("/insertData", permission);

// list permission
is_permissionRoutes.get("/listPermission", listpermission);

module.exports = is_permissionRoutes;

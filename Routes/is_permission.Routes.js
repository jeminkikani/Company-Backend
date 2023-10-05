const express = require("express");
const { permission, listpermission } = require("../controller/is_permission.controller");

const is_permissionRoutes = express.Router();

is_permissionRoutes.post("/ispermission/data/insertdata", permission);

// list permission
is_permissionRoutes.get("/ispermission/data/listpermission", listpermission);

module.exports = is_permissionRoutes;

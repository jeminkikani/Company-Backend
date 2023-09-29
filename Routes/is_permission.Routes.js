const express = require("express");
const { permission } = require("../controller/is_permission.controller");

const is_permissionRoutes = express.Router();

is_permissionRoutes.post("/ispermission/data/insert-data", permission);

module.exports = is_permissionRoutes;

const express = require("express");
const { permission } = require("../controllar/ispermission.controlar");

const ispermissionRoutes = express.Router();

ispermissionRoutes.post("/ispermission/data/insert-data", permission);

module.exports = ispermissionRoutes;

const express = require("express");
const {createGroup,viewGroup,updateGroup,deleteGroup,listGroup,alldata, fetchiddata} = require("../controllar/Group.controllar");
const { isveryfy } = require("../middlware/auth");
const checkPermissionMiddleware = require("../middlware/check.permission");
const groupRoutes = express.Router();

groupRoutes.post("/create-group",isveryfy,checkPermissionMiddleware("createGroup"),createGroup);

groupRoutes.get("/view-group",isveryfy,checkPermissionMiddleware("createGroup"),viewGroup);

groupRoutes.post("/update-group",isveryfy,checkPermissionMiddleware("createGroup"),updateGroup);

groupRoutes.delete("/delete-group",isveryfy,checkPermissionMiddleware("createGroup"),deleteGroup);

groupRoutes.get("/list-group", listGroup);

groupRoutes.get("/all-data", isveryfy ,checkPermissionMiddleware("createGroup"), alldata)

groupRoutes.get("/get-compnay-id/get-group/:id",isveryfy,checkPermissionMiddleware("createGroup"),fetchiddata);

module.exports = groupRoutes;

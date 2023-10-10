const express = require('express')
const { createLocation, viewLocation, listLocation, updateLocation, deleteLocation  } = require("../controller/location.controller");
const { IsVerify } = require("../middleware/auth");
const locationRoutes = express.Router();

//ProductCategory
locationRoutes.post("/create", IsVerify("Admin"), createLocation);

// viewCategory
locationRoutes.get('/view/:id', IsVerify('Admin'), viewLocation);

// updateCategory
locationRoutes.put('/update/:id', IsVerify('Admin'), updateLocation);

//deleteCategory
locationRoutes.delete("/delete/:id", IsVerify("Admin"), deleteLocation);

//listCategory
locationRoutes.get('/list', IsVerify('Admin'), listLocation);


module.exports = locationRoutes
const express = require('express')
const {createVendor, viewVendor, updateVendor, listVendor, deleteVendor } = require('../controller/vendor.controller')
const { IsVerify } = require("../middleware/auth");
const VendorRoutes = express.Router();

//createCategory
VendorRoutes.post("/create", IsVerify("Admin"), createVendor);

// viewCategory
VendorRoutes.get("/view", IsVerify("Admin"), viewVendor);

// updateCategory
VendorRoutes.put("/update/:id", IsVerify("Admin"), updateVendor);

//deleteCategory
VendorRoutes.delete("/delete/:id", IsVerify("Admin"), deleteVendor);

//listCategory
VendorRoutes.get("/list", IsVerify("Admin"), listVendor);


module.exports = VendorRoutes
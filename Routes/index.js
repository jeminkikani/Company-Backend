const express = require('express')
const Routes = express.Router()

//userRoutes
const userRoutes = require("./user.Routes");
Routes.use("/User", userRoutes);

// companyRoutes
const is_permissionRoutes = require("./is_permission.Routes");
Routes.use("/permission", is_permissionRoutes);

// companyRoutes
const companyRoutes = require("./company.Routes");
Routes.use('/Company', companyRoutes)

// groupRoutes 
const groupRoutes = require("./Group.Routes");
Routes.use('/group', groupRoutes)

// groupUserRoutes
const groupUserRoutes = require("./groupUser.Routes");
Routes.use('/groupUser', groupUserRoutes)

// categoryRoutes
const categoryRoutes = require("./category.routes");
Routes.use('/Category', categoryRoutes )

// VendorRoutes
const VendorRoutes = require("./vendor.Routes");
Routes.use('/vendor', VendorRoutes);

// productRoutes
const productRoutes = require("./product.Routes");
Routes.use('/product', productRoutes)

// locationRoutes
const locationRoutes = require('./location.Routes');
Routes.use('/location', locationRoutes);

//AssetsRoutes
const assetsRoutes = require('./assets.Routes');
Routes.use("/Assets", assetsRoutes);

module.exports = Routes
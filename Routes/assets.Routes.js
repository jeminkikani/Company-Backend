const express = require('express')
const {createAssets,viewAssets,updateAssets,listAssets,deleteAssets} = require("../controller/assets.controller");
const { IsVerify } = require("../middleware/auth");
const assetsRoutes = express.Router();

//createAssets
assetsRoutes.post("/create", IsVerify("Admin"), createAssets);

// viewAssets
assetsRoutes.get('/view', IsVerify('Admin'), viewAssets);

// updateAssets
assetsRoutes.put('/update/:id', IsVerify('Admin'), updateAssets);

//deleteAssets
assetsRoutes.delete('/category/delete/:id', IsVerify('Admin'), deleteAssets);

//listAssets
assetsRoutes.get('/list', IsVerify('Admin'), listAssets);


module.exports = assetsRoutes
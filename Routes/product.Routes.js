const express = require('express')
const {createProduct, viewProduct, updateProduct, listProduct, deleteProduct } = require('../controller/product.controller')
const { IsVerify } = require("../middleware/auth");
const productRoutes = express.Router();

//ProductCategory
productRoutes.post("/create", IsVerify("Admin"), createProduct);

// viewCategory
productRoutes.get('/view/:id', IsVerify('Admin'), viewProduct);

// updateCategory
productRoutes.put('/update/:id', IsVerify('Admin'), updateProduct);

//deleteCategory
productRoutes.delete('/delete/:id', IsVerify('Admin'), deleteProduct);

//listCategory
productRoutes.get('/list', IsVerify('Admin'), listProduct);


module.exports = productRoutes
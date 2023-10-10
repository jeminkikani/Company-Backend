const express = require('express')
const {createCategory, viewCategory, updateCategory, listCategory, deleteCategory } = require('../controller/category.controller')
const { IsVerify } = require("../middleware/auth");
const categoryRoutes = express.Router()

//createCategory
categoryRoutes.post("/create", IsVerify("Admin"), createCategory);

// viewCategory
categoryRoutes.get('/view', IsVerify('Admin'), viewCategory);

// updateCategory
categoryRoutes.put('/update/:id', IsVerify('Admin'), updateCategory);

//deleteCategory
categoryRoutes.delete('/category/delete/:id', IsVerify('Admin'), deleteCategory);

//listCategory
categoryRoutes.get('/list', IsVerify('Admin'), listCategory);


module.exports = categoryRoutes
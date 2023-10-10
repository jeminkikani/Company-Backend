const Product = require("../models/product.model");
const Vendor = require('../models/vendor.model')
const User = require("../models/user.model");

//createCategory
exports.createProduct = async (req, res) => {
  try {
    const { Name, model, description, Notes, category_id, vendor_id } = req.body;
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({
        status: "Fail",
        message: "user is not found",
      });
    }

    const VendorId = await Vendor.findById(vendor_id);
    if (!VendorId) {
      return res.status(400).json({
        status: "Fail",
        message: "VenderId is not Exist",
      });
    }

    const isExistProduct = await Product.findOne({ Name , vendor_id});
    if (isExistProduct) {
      return res.status(400).json({
        status: "Fail",
        message: "Product Name is already exists.",
      });
    }

    const newProduct = new Product({
      Name,
      model,
      description,
      Notes,
      category_id,
      vendor_id,
    });

    await newProduct.save();

    res.status(201).json({
      status: "Success",
      message: "New Product Added",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ status: "Fail", message: "Internal Server Error" });
  }
};

// viewCategory
exports.viewProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "Fail", message: "user is not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ status: "Fail", message: "Product is not found" });
    }

    res.status(201).json({
      status: "success",
      message: "category Fetch successfully",
      data: product,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: "something went wrong",
      data: error.message,
    });
  }
};

// updateCategory
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const isExistProduct = await Product.findById(productId);
    if (!isExistProduct) {
      return res
        .status(400)
        .json({ status: "Fail", message: "product is not exists." });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        status: "Fail",
        message: "user is not found",
      });
    }

    const updateFields = { ...req.body };

    const updateProduct = await Product.findByIdAndUpdate(productId,updateFields);

    if (!updateProduct) {
      return res
        .status(404)
        .json({ status: "Fail", message: "Product not found" });
    }

    res.status(200).json({
      status: "Success",
      message: "Category update successfully",
      data: updateProduct,
    });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ status: "Fail", message: "something went wrong", data: error });
  }
};

// deleteCategory;
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res
        .status(404)
        .json({ status: "Fail", message: "product is not found" });
    }
    const isExistProduct = await Product.findById(productId);
    console.log(isExistProduct);
    if (!isExistProduct) {
      return res
        .status(400)
        .json({ status: "Fail", message: "product is not exists." });
    }
    const Products = await Product.findByIdAndDelete(productId);
    res.status(404).json({
      status: "Success",
      message: "delete product successfully",
      data: {},
    });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ status: "Fail", message: "something went wrong", data: error });
  }
};

// listProducts
exports.listProduct = async (req, res) => {
  try {
    const product = await Product.find();
    if (!product) {
      return res
        .status(404)
        .json({ status: "Fail", message: "Category is not found" });
    }
    res.status(200).json({
      status: "success",
      message: "Category Fetch successfully",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ status: "Fail", message: "something wen wrong", data: error });
  }
};

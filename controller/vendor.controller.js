const Vendor = require("../models/vendor.model");
const User = require("../models/user.model");

//createVendor
exports.createVendor = async (req, res) => {
  try {
    const { Name, description, website, Notes, company_id } = req.body;
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({
        status: "Fail",
        message: "user is not found",
      });
    }

    const userCompanyId = req.user.company_id;
    if (!userCompanyId) {
      return res.status(400).json({
        status: "Fail",
        message: "Vendor is not create for this User",
      });
    }

    const isExistVendor = await Vendor.findOne({ Name });
    if (isExistVendor) {
      return res.status(400).json({
        status: "Fail",
        message: "Vendor Name is already exists.",
      });
    }

    const newVendor = new Vendor({
      Name,
      description,
      website,
      Notes,
      company_id: userCompanyId,
    });

    await newVendor.save();

    res
      .status(201)
      .json({
        status: "Success",
        message: "New Vendor Added",
        data: newVendor,
      });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ status: "Fail", message: "Internal Server Error" });
  }
};

// viewCategory
exports.viewVendor = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "Fail", message: "user is not found" });
    }

    const vendor = await Vendor.find({ company_id: user.company_id });
    if (!vendor) {
      return res
        .status(404)
        .json({ status: "Fail", message: "company id is not found" });
    }

    res.status(201).json({
      status: "success",
      message: "category Fetch successfully",
      data: vendor,
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
exports.updateVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;

    const isExistVendor = await Vendor.findById(vendorId);
    if (!isExistVendor) {
      return res
        .status(400)
        .json({ status: "Fail", message: "category is not exists." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        status: "Fail",
        message: "user is not found",
      });
    }

    const { Name, ...updateData } = req.body;

    const updateVendor = await Vendor.findOneAndUpdate(
      { company_id: user.company_id },
      { $set: { ...updateData, Name } },
      { new: true }
    );

    if (!updateVendor) {
      return res
        .status(404)
        .json({ status: "Fail", message: "vendor not found" });
    }

    res.status(200).json({
      status: "Success",
      message: "Category update successfully",
      data: updateVendor,
    });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ status: "Fail", message: "something went wrong", data: error });
  }
};

// deleteCategory;
exports.deleteVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;
    if (!vendorId) {
      return res
        .status(404)
        .json({ status: "Fail", message: "category is not found" });
    }
    const isExistVendor = await Vendor.findById(vendorId);
    if (!isExistVendor) {
      return res
        .status(400)
        .json({ status: "Fail", message: "vendor is not exists." });
    }
    const vendor = await Vendor.findByIdAndDelete(vendorId);
    res.status(404).json({
      status: "Success",
      message: "delete vendor successfully",
      data: {},
    });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ status: "Fail", message: "something wen wrong", data: error });
  }
};

// list-group
exports.listVendor = async (req, res) => {
  try {
    const vendor = await Vendor.find();
    if (!vendor) {
      return res
        .status(404)
        .json({ status: "Fail", message: "vendor is not found" });
    }
    res.status(200).json({
      status: "success",
      message: "Category Fetch successfully",
      data: vendor,
    });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ status: "Fail", message: "something wen wrong", data: error });
  }
};

const Category = require('../models/category.model')
const User = require('../models/user.model')

//createCategory
exports.createCategory = async (req,res) =>{
    try {
        const { Name, description, company_id } = req.body;
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
            message: "category is not create for this User",
          });
        }

        const isExistCategory = await Category.findOne({ Name });
        if (isExistCategory) {
          return res.status(400).json({
            status: "Fail",
            message: "Category Name is already exists.",
          });
        }

        const newCategory = new Category({
          Name,
          description,
          company_id: userCompanyId,

        });

        await newCategory.save();

        res
            .status(201)
            .json({ status: "Success", message: "New Category Added", data:newCategory });


    } catch (error) {
         console.error("Error creating user:", error);
         res
           .status(500)
           .json({ status: "Fail", message: "Internal Server Error" });
    }
}

// viewCategory
exports.viewCategory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "Fail", message: "user is not found" });
    }

    const category = await Category.find({ company_id: user.company_id });
    if (!category) {
      return res
        .status(404)
        .json({ status: "Fail", message: "company id is not found" });
    }

    res.status(201).json({
      status: "success",
      message: "category Fetch successfully",
      data: category,
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
exports.updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const isExistCategory = await Category.findById(categoryId);
    if (!isExistCategory) {
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

    const updateCategory = await Category.findOneAndUpdate(
      { company_id: user.company_id },
      { $set: { ...updateData, Name } },
      { new: true }
    );

    if (!updateCategory) {
      return res
        .status(404)
        .json({ status: "Fail", message: "Category not found" });
    }

    res.status(200).json({
      status: "Success",
      message: "Category update successfully",
      data: updateCategory,
    });

  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ status: "Fail", message: "something went wrong", data: error });
  }
};

// deleteCategory;
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    if (!categoryId) {
      return res
        .status(404)
        .json({ status: "Fail", message: "category is not found" });
    }
    const isExistCategory = await Category.findById(categoryId);
    if (!isExistCategory) {
      return res
        .status(400)
        .json({ status: "Fail", message: "category is not exists." });
    }
    const category = await Category.findByIdAndDelete(categoryId);
    res.status(404).json({
      status: "Success",
      message: "delete category successfully",
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
exports.listCategory = async (req, res) => {
  try {
    const category = await Category.find();
    if (!category) {
      return res
        .status(404)
        .json({ status: "Fail", message: "Category is not found" });
    }
    res.status(200).json({
      status: "success",
      message: "Category Fetch successfully",
      data: category,
    });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ status: "Fail", message: "something wen wrong", data: error });
  }
};

const Company = require("../models/company.model");
const User = require("../models/user.model");
const ispermission = require("../models/is_permission.model");
const jwt = require("jsonwebtoken");

async function handleIsPermission(companyId) {
  try {
    const roles = ["SuperAdmin", "Admin", "User"];
    const routes = [
      "createGroup",
      "updateGroup",
      "listGroup",
      "viewGroup",
      "deleteGroup",
    ];

    const permissions = [];

    roles.forEach((role) => {
      routes.forEach((route) => {
        const entry = {
          role,
          route,
          company_id: companyId,
          isPermission: true,
        };
        permissions.push(entry);
      });
    });
    const result = await ispermission.insertMany(permissions);
    console.log("Permissions inserted:", result);
  } catch (error) {
    console.error("Error inserting permissions:", error);
    throw error;
  }
}
exports.create_company = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.json({ status: "Fail", message: "user is not found" });
    }

      if (user.company_id !== null) {
        return res.status(400).json({
          status: "Fail",
          message: "User is already associated with a company",
        });
      }
    const { register_no, company_name, company_address, contact_no } = req.body;

    const isExistCompanyNo = await Company.findOne({ register_no });
    if (isExistCompanyNo) {
      return res.status(409).json({
        status: "Fail",
        message: "This register_no is not allowed for duplicate number",
      });
    }

    const newCompany = new Company({
      register_no,
      company_name,
      company_address,
      contact_no,
    });

    const userId = req.user.id;
    await User.findByIdAndUpdate(userId, { company_id: newCompany._id });

    await newCompany.save();

    await handleIsPermission(newCompany._id);

    return res.status(200).json({
      status: "Success",
      message: "Company created and permissions updated.",
    });
  } catch (error) {
    console.error("Error creating company:", error);
    res.status(500).json({ status: "Fail", message: "Internal Server Error" });
  }
};

// view company
exports.view_company = async (req, res) => {
  try {
    const userId = req.user.id;
    const users = await User.findById(userId).populate("company_id");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error view company:", error);
    res.status(500).json({ status: "Fail", message: "Internal Server Error" });
  }
};

// update company
exports.update_company = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.json({ status: "Fail", message: "user is not found" });
    }
    // { $set: { ...req.body } }
    const companyId = user.company_id;

    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      { $set: { ...req.body } },
      { new: true }
    );

    if (!updatedCompany) {
      return res
        .status(404)
        .json({ status: "Fail", error: "Company not found" });
    }

    res.status(202).json({
      status: "Success",
      data: updatedCompany,
      message: "update company Successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "Fail", message: "something wen wrong", data: error });
  }
};

exports.JoinCompany = async (req, res) => {
  try {
    const user_id = req.params.id;

    
    const existingUser = await User.findById(user_id);
    if (!existingUser) {
      return res.status(404).json({ status: "Fail", error: "User not found" });
    }

    if (existingUser.company_id !== null) {
      return res.status(400).json({
        status: "Fail",
        message: "User is already associated with a company",
      });
    }

    const { register_no, company_name, company_address, contact_no } = req.body;

    const isExistCompanyNo = await Company.findOne({ register_no });
    if (isExistCompanyNo) {
      return res.json({
        status: "Fail",
        message: "this register_no filed is not allow for duplicate number",
      });
    }

    const newCompany = new Company({
      register_no,
      company_name,
      company_address,
      contact_no,
    });

    await newCompany.save();

    const userId = req.user.id;
    await User.findByIdAndUpdate(userId, { company_id: newCompany._id });

    return res.status(200).json({
      status: "Success",
      message: "User joined the company successfully",
      newCompany,
    });
  } catch (error) {
    res.status(500).json({ status: "Fail", error: "Internal server error" });
  }
};

// exports.create_company = async (req, res) => {
//   try {
//     console.log(req.user);
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.json({ status: "Fail", msg: "user is not found...." });
//     }

//       const { register_no, company_name, company_address, contact_no } = req.body;

//       const isExistCompanyNo = await Company.findOne({ register_no });
//     if (isExistCompanyNo) {
//       return res.status(409).json({
//         status: "Fail",
//         msg: "this register_no filed is not allow for duplicate number",
//       });
//     }

//     // console.log(req.user._id);
//     const newCompany = new Company({
//       register_no,
//       company_name,
//       company_address,
//       contact_no,
//     });
//     //  console.log(newCompany);
//     await newCompany.save();

//         if (user.company_id !== null) {
//           return res
//             .status(400)
//             .json({
//               status: "Fail",
//               mag: "User is already associated with a company",
//             });
//         }

//     const userId = req.user.id;
//     await User.findByIdAndUpdate(userId, { company_id: newCompany._id });

//     return res.status(200).json({
//       status: "Success",
//       msg: "company is created...",
//     });
//   } catch (error) {
//     console.error("Error creating company:", error);
//     res.status(404).json({ status: "Fail", msg: "Internal Server Error" });
//   }
// };

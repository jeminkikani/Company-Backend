const Group = require("../models/Group.model");
const User = require("../models/user.model");
const Company = require("../models/company.model");
const mongoose = require("mongoose");

const GroupUser = require("../models/groupUser.model");

//create
exports.createGroup = async (req, res) => {
  try {
    const { Name, description } = req.body;
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
        message: "group is not create for this User",
      });
    }

    const isExistUser = await Group.findOne({ Name });
    if (isExistUser) {
      return res
        .status(400)
        .json({ status: "Fail", message: "Group Name is already exists." });
    }

    const newGroup = new Group({
      Name,
      description,
      company_id: userCompanyId,
    });

    await newGroup.save(); // Save the new group to the database
    // Store data in GroupUc  ser collection
    const groupUser = new GroupUser({
      user_id: userId,
      group_id: newGroup._id,
      groupUserRole: "groupAdmin",
    });

    await groupUser.save(); // Save the new groupUser to the database

    res
      .status(201)
      .json({ status: "Success", message: "New Group Added", newGroup });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ status: "Fail", message: "Internal Server Error" });
  }
}; 

// view-group
exports.viewGroup = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "Fail", message: "user is not found" });
    }

    const group = await Group.find({ company_id: user.company_id });
    if (!group) {
      return res
        .status(404)
        .json({ status: "Fail", message: "group id is not found" });
    }

    res.status(201).json({
      status: "success",
      message: "user Fetch successfully",
      data: group,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: "something went wrong",
      data: error.message,
    });
  }
};

// update group
exports.updateGroup = async (req, res) => {
  try {
    const groupid = req.params.id;
    const isExistGroup = await Group.findById(groupid);
    console.log(isExistGroup);
    if (!isExistGroup) {
      return res
        .status(400)
        .json({ status: "Fail", message: "Group is not exists." });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        status: "Fail",
        message: "user is not found",
      });
    }

    const { Name, ...updateData } = req.body;

    const updateGroup = await Group.findOneAndUpdate(
      { company_id: user.company_id },
      { $set: { ...updateData, Name } },
      { new: true }
    );

    if (!updateGroup) {
      return res
        .status(404)
        .json({ status: "Fail", message: "Group not found" });
    }

    res.status(200).json({
      status: "Success",
      message: "update group successfully",
      data: updateGroup,
    });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ status: "Fail", message: "something went wrong", data: error });
  }
};

//delete-group
exports.deleteGroup = async (req, res) => {
  try {
    const groupid = req.params.id;
    if (!groupid) {
      return res
        .status(404)
        .json({ status: "Fail", message: "group is not found" });
    }
    const isExistGroup = await Group.findOne({ groupid });
    if (!isExistGroup) {
      return res
        .status(400)
        .json({ status: "Fail", message: "Group is not exists." });
    }
    const group = await Group.findByIdAndDelete(groupid);
    res.status(404).json({
      status: "Success",
      message: "delete group successfully",
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
exports.listGroup = async (req, res) => {
  try {
    const groups = await Group.find();
    if (!groups) {
      return res
        .status(404)
        .json({ status: "Fail", message: "group is not found" });
    }
    res.status(200).json({
      status: "success",
      message: "user Fetch successfully",
      data: groups,
    });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ status: "Fail", message: "something wen wrong", data: error });
  }
};

// All data 
exports.alldata = async (req, res) => {
  try {
    const companyId = req.user.company_id;

    if (!companyId) {
      return res.status(404).json({
        status: "Fail",
        message: "Company ID not found for this user",
        data: null,
      });
    }

    const user = await User.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.user.id) },
      },
      { $limit: 1 },
      {
        $lookup: {
          from: "companies",
          localField: "company_id",
          foreignField: "_id",
          as: "company",
          pipeline: [
            {
              $lookup: {
                from: "groups",
                localField: "_id",
                foreignField: "company_id",
                as: "groups",
              },
            },
          ],
        },
      },
      {
        $addFields: {
          company: { $arrayElemAt: ["$company", 0] },
        },
      },
      {
        $project: {
          _id: 0,
          __v: 0,
          createdAt: 0,
          updatedAt: 0,
          "company._id": 0,
          "company.__v": 0,
          "company.createdAt": 0,
          "company.updatedAt": 0,
        },
      },
        {
    $unset: ["company.groups.createdAt", "company.groups.updatedAt", "company.groups.__v"]
  }
  ]);
    const user1 = user[0] || null;

    res.status(200).json({
      status: "Success",
      message: "Company data fetched successfully",
      data: user1,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "Fail",
      message: "Something went wrong",
      data: error,
    });
  }
};

// using companyid fetch group data
exports.fetchiddata = async (req, res) => {
  try {
    // Assuming the company ID is stored in the token
    const companyId = req.user.company_id;

    if (!companyId) {
      return res.status(400).json({
        status: "Fail",
        message: "Company ID not provided in the token",
      });
    }

    // Fetch the company details based on the provided company_id
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        status: "Fail",
        message: "Company not found",
      });
    }

    // Fetch all groups based on the provided company_id
    const groups = await Group.find({ company_id: companyId });

    // Initialize an empty object to store the transformed data
    const groupsObject = {};

    groups.forEach((group) => {
      groupsObject[group._id] = {
        Name: group.Name,
        description: group.description,
        // Add other properties as needed
      };
    });

    res.status(200).json({
      status: "Success",
      message: "Groups fetched successfully",
      company,
      group: groupsObject,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "Fail",
      message: "Something went wrong",
      data: error.message,
    });
  }
};

// exports.alldata = async (req, res) => {
//   try {
//     const companyId = req.user.company_id;

//     if (!companyId) {
//       return res.status(404).json({
//         status: "Fail",
//         message: "Company ID not found for this user",
//         data: null,
//       });
//     }

//     const groupsWithCompanyData = await Group.aggregate([
//       {
//         $match: { company_id: companyId },
//       },
//       {
//         $lookup: {
//           from: "companies",
//           localField: "company_id",
//           foreignField: "_id",
//           as: "companyArray",
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           __v: 0,
//           createdAt: 0,
//           updatedAt: 0,
//           company: { $arrayElemAt: ["$companyArray", 0] },
//           "company._id": 0,
//           "company.__v": 0,
//           "company.createdAt": 0,
//           "company.updatedAt": 0,
//         },
//       },
//     ]);

//     res.status(200).json({
//       status: "Success",
//       message: "Company data fetched successfully",
//       data: { groupsWithCompanyData },
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({
//       status: "Fail",
//       message: "Something went wrong",
//       data: error.message,
//     });
//   }
// };

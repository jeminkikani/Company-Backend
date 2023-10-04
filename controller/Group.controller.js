const Group = require("../models/Group.model");
const User = require("../models/user.model");
const GroupUser = require("../models/groupUser.model");

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
        message: "company is not create for this User",
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
      .json({ status: "Success", newGroup, message: "New Group Added." });
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
    if (!groupid) {
      return res
        .status(404)
        .json({ status: "Fail", message: "group is not found" });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        status: "Fail",
        message: "user is not found",
      });
    }
    const updateGroup = await Group.findOneAndUpdate(
      { company_id: user.company_id },
      { $set: { ...req.body } },
      { new: true }
    );
    res.status(200).json({
      status: "Success",
      data: updateGroup,
      message: "update group successfully",
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
    const user = await Group.findByIdAndDelete(groupid);
    res.status(404).json({
      status: "Success",
      data: {},
      message: "delete user successfully",
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

// alldata
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

    const groupsWithCompanyData = await Group.aggregate([
      {
        $match: { company_id: companyId },
      },
      {
        $lookup: {
          from: "companies",
          localField: "company_id",
          foreignField: "_id",
          as: "company",
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
    ]);

    const groupedData = {};
    groupsWithCompanyData.forEach((item) => {
      const companyId = item.company_id;
      if (!groupedData[companyId]) {
        groupedData[companyId] = {
          company: item.company[0],
          groups: [],
        };
      }
      groupedData[companyId].groups.push({
        Name: item.Name,
        description: item.description,
      });
    });

    const userInformation = {
      id: req.user.id,
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      email: req.user.email,
      role: req.user.role,
      company_id: req.user.company_id,
    };

    res.status(200).json({
      status: "Success",
      message: "Company data fetched successfully",
      data: {
        userInformation,
        groupedData,
      },
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
// using companyid fetch group data
exports.fetchiddata = async (req, res) => {
  try {
    const companyId = req.params.id; // Fetching company ID from URL parameters

    if (!companyId) {
      return res.status(400).json({
        status: "Fail",
        message: "Company ID not provided in URL",
        data: null,
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
      data: { group: groupsObject },
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

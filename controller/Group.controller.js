const Group = require("../models/Group.model");
const User = require("../models/user.model");
const GroupUser = require("../models/groupUser.model");

exports.createGroup = async (req, res) => {
  try {
    const { Name, description } = req.body;
    const userId = req.user.id;
    // console.log(userId);
    if (!userId) {
      return res
        .status(400)
        .json({ 
          status: "Fail",
          msg: "user is not found...." 
        });
    }
    // console.log(req.user);
    const userCompanyId = req.user.company_id;
    console.log(userCompanyId);
    if (!userCompanyId) {
      return res
        .status(400)
        .json({
          status: "Fail",
          msg: "company is not create for this User...",
        });
    }

    const isExistUser = await Group.findOne({ Name });
    if (isExistUser) {
      return res
        .status(400)
        .json({ status: "Fail", msg: "Group Name is already exists." });
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

    res.status(201).json({ status: "Success", newGroup, msg: "New Group Added." });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ status: "Fail", msg: "Internal Server Error" });
  }
};

// get-user
exports.viewGroup = async (req, res) => {
  try {
    // console.log(req.user);
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({status: "Fail", msg: "user is not found...." });
    }

    const group = await Group.findById({ company_id: user.company_id });
    if (!group) {
      return res.status(404).json({status: "Fail", msg: "group id is not found...." });
    }

    // console.log(group);
    res.status(201).json({
      status: "success",
      message: "user Fetch successfully",
      data: group,
    });
  } catch (error) {
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>", error);
    res.status(404).json({
      status: "Fail",
      message: "something went wrong",
      data: error.message,
    });
  }
};

// update user
exports.updateGroup = async (req, res) => {
  try {
    const user = await Group.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ 
          status: "Fail",
          msg: "user is not found...." 
        });
    }
    const updateUser = await Group.findByIdAndUpdate(
      user._id,
      { $set: { ...req.body } },
      { new: true }
    );
    updateUser.save();
    res.status(200).json({
      status: "Success",
      data: updateUser,
      msg: "update user successfully..",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ status: "Fail", message: "something wen wrong", data: error });
  }
};

//delete-group
exports.deleteGroup = async (req, res) => {
  try {
    const user = Group.findOneAndDelete({ user: Group._id });
    if (!user) {
      return res
        .status(404)
        .json({ 
          status: "Fail",
          msg: "user is not found...." 
        });
    }
    res
      .status(404)
      .json({ status: "Success", data: {}, msg: "delete user successfully.." });
  } catch (error) {
    console.log(error);
    res.status(404).json({ status: "Fail", message: "something wen wrong", data: error });
  }
};

// list-group
exports.listGroup = async (req, res) => {
  try {
    const users = await Group.find();
    if (!users) {
      return res
        .status(404)
        .json({ status: "Fail", msg: "group is not found...." });
    }
    res.status(200).json({
      status: "success",
      message: "user Fetch successfully",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ status: "Fail", message: "something wen wrong", data: error });
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

    res.status(200).json({
      status: "Success",
      message: "Company data fetched successfully",
      data: { groupsWithCompanyData },
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

    res.status(200).json({
      status: "Success",
      message: "Groups fetched successfully",
      data: { groups },
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
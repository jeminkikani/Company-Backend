const Group = require("../models/Group.model");
const User = require("../models/user.model");

exports.createGroup = async (req, res) => {
  try {
    const { Name, description } = req.body;

    const userId = req.user._id;
    if (!userId) {
      return res.json({ msg: "user is not found...." });
    }

    const userCompanyId = req.user.company_id;

    const isExistUser = await Group.findOne({ Name });

    if (isExistUser)
      return res.status(400).json({ msg: "Group Name is already exists." });

    const newUser = new Group({
      Name,
      description,
      company_id: userCompanyId,
    });

    await newUser.save(); // Save the new user to the database

    res.status(201).json({ newUser, msg: "New Group Added." });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// get-user
exports.viewGroup = async (req, res) => {
  try {
    // console.log(req.user);
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.json({ msg: "user is not found...." });
    }

    const group = await Group.findById(Group._id);
    if (!group) {
      return res.json({ msg: "group id is not found...." });
    }

    console.log(group);
    res.status(201).json({
      status: "Sucess",
      message: "user Fetch sucessfully",
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
    const user = await Group.findById(req.user._id);
    if (!user) {
      return res.json({ msg: "user is not found...." });
    }
    const updateuser = await Group.findByIdAndUpdate(
      user._id,
      { $set: { ...req.body } },
      { new: true }
    );
    updateuser.save();
    res.status(200).json({
      status: "Success",
      data: updateuser,
      msg: "update user Sucessfully..",
    });
  } catch (error) {
    console.log(error);
    res.json({ sttus: "Fail", message: "something wen wrong", data: error });
  }
};

//delete-group
exports.deleteGroup = async (req, res) => {
  try {
    const user = Group.findOneAndDelete({ user: Group._id });
    if (!user) {
      return res.json({ msg: "user is not found...." });
    }
    res.status(404).json({ data: {}, msg: "delete user Sucessfully.." });
  } catch (error) {
    console.log(error);
    res.json({ sttus: "Fail", message: "something wen wrong", data: error });
  }
};

// list-group
exports.listGroup = async (req, res) => {
  try {
    const users = await Group.find();
    if (!users) {
      return res.json({ msg: "group is not found...." });
    }
    res.status(200).json({
      status: "Sucess",
      message: "user Fetch sucessfully",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.json({ sttus: "Fail", message: "something wen wrong", data: error });
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
          "company.updatedAt": 0
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

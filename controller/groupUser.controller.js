const GroupUser = require("../models/groupUser.model");
const Group = require("../models/Group.model");

exports.joinGroup = async (req, res) => {
  try {
    const groupId = req.params.id; // Assuming groupId is provided in the URL parameters
    const userId = req.user.id;
    console.log(groupId);
    // Check if the user and group exist
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ status: "Fail", msg: "Group not found" });
    }

    const existingMember = await GroupUser.findOne({
      user_id: userId,
      group_id: groupId,
    });

    if (existingMember) {
      return res
        .status(400)
        .json({
          status: "Fail",
          msg: "User is already a member of this group",
        });
    }

    // Create a new GroupUser record
    const groupUser = new GroupUser({
      user_id: userId,
      group_id: groupId,
      groupUserRole: "groupAdmin", // Assuming the user is a member when joining
    });

    await groupUser.save();

    res
      .status(200)
      .json({ status: "success", msg: "User joined the group successfully." });
  } catch (error) {
    res.status(500).json({ status: "Fail", msg: "Internal Server Error" });
  }
};

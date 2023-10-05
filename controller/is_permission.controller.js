const ispermission = require("../models/is_permission.model");

exports.permission = async (req, res) => {
  const roles = ["SuperAdmin", "Admin", "User"];

  const routes = [
    "createGroup",
    "updateGroup",
    "listGroup",
    "viewGroup",
    "deleteGroup",
  ];

  // const roles = { SuperAdmin: "SuperAdmin", Admin: "Admin", User: "User" };

  // const routes = {
  //   createGroup: "createGroup",
  //   updateGroup: "updateGroup",
  //   listGroup: "listGroup",
  //   viewGroup: "viewGroup",
  //   deleteGroup: "deleteGroup",
  // };

  let arr = [];

  // const roleKeys = Object.keys(roles);
  // const routeKeys = Object.keys(routes);

  // for (let i = 0; i < roleKeys.length; i++) {
  //   for (let j = 0; j < routes.length; j++) {
  //     const entry = {
  //       role: roles[roleKeys[i]],
  //       route: routes[routes[j]],
  //       company_id: 1,
  //       isPermission: true,
  //     };
  //     // console.log(entry);
  //     arr.push(entry);
  //   }
  // }

  roles.forEach((role) => {
    routes.forEach((route) => {
      const entry = {
        role,
        route,
        ispermission_id: 1,
        isPermission: true,
      };
      arr.push(entry);
    });
  });

  try {
    const result = await ispermission.insertMany(arr);
    res.status(200).json({
      status: "success",
      message: "Data inserted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      message: "Error inserting data into MongoDB",
      data: {},
    });
  }
};

exports.listpermission = async (req,res) => {

  try {
  const listdata = await ispermission.find();
  if (!listdata) {
    return res.status(404).json({
      status: "Fail",
      message: "permission is not create for user",
    });
  }

  res.status(200).json({
    status: "success",
    message: "user permission Fetch successfully",
    data: listdata,
  });
    
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: "something went wrong",
      data: error.message,
  });
  }

}

/* // view-group
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
}; */
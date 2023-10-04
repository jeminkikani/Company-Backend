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

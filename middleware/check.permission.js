const User = require("../models/user.model");
const ispermission = require("../models/is_permission.model");

const validRoutes = [
  "createGroup",
  "updateGroup",
  "listGroup",
  "viewGroup",
  "deleteGroup",
];

const validRoles = ["Admin", "SuperAdmin", "User"];

const checkPermissionMiddleware = (action) => async (req, res, next) => {
  try {
    const role = req.user.role;
    const user = await User.findById(req.user.id);

    if (!validRoutes.includes(action)) {
      return res.status(403).json({ error: "Invalid route" });
    }

    if (!validRoles.includes(user.role)) {
      return res.status(403).json({ error: "Invalid role" });
    }

    const checkispermission = await ispermission.find({
      where: {
        role: user.role,
        route: action,
      },
    });

    if (!checkispermission) {
      return res
        .status(403)
        .json({ error: "Permission denied for this company" });
    }

    next();
  } catch (error) {
    console.error("Error checking permissions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = checkPermissionMiddleware;

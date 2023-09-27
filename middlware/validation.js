const { body, validationResult } = require("express-validator");

module.exports.validator = {
  FIRSTNAME: body("firstname")
    .not()
    .isEmpty()
    .withMessage("no Space are allowed Firstname")
    .isAlpha()
    .withMessage("must be chracter in firstname"),

  LASTNAME: body("lastname")
    .not()
    .isEmpty()
    .withMessage("No spaces are allowed lastname")
    .isAlpha()
    .withMessage("must be character in lastname"),

  EMAIL: body("email")
    .not()
    .isEmpty()
    .withMessage("no space are allowed email")
    .isEmail()
    .withMessage("Invalid email format"),

  PASSWORD: body("password")
    .not()
    .isEmpty()
    .withMessage("password Is Required")
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 characters long"),

  ROLE: body("role")
    .not()
    .isEmpty()
    .withMessage("Role is required")
    .custom((value) => {
      const allowedRoles = ["Admin", "Sub_Admin", "User"];
      if (!allowedRoles.includes(value)) {
        throw new Error("Invalid role");
      }
      return true;
    }),
};
module.exports.validPassword = (req, res, next) => {
  const requiredFields = ["password", "newPassword", "confirm_Password"];
  const missingFields = requiredFields.filter(
    (field) => !Object.keys(req.body).includes(field)
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      status: "fail",
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }
  const extraFields = Object.keys(req.body).filter(
    (field) => !requiredFields.includes(field)
  );
  if (extraFields.length > 0) {
    return res.status(400).json({
      status: "fail",
      message: `Extra fields are not valid: ${extraFields.join(", ")}`,
    });
  }
  next();
};

module.exports.validateReq = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errMsg = errors.errors.map((err) => err.msg);
    if (errMsg && errMsg.length > 0)
      return res
        .status(400)
        .send({ status: false, message: errMsg[0], data: {} });
  } else {
    return next();
  }
};

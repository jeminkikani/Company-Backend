const { body, validationResult } = require("express-validator");
// validateUser
// Validation middleware for a specific route

module.exports.validator = {
  FIRSTNAME: body("firstname")
    .not()
    .custom((value) => !/\s/.test(value))
    .withMessage("no Space are allowed Firstname")
    .isAlpha()
    .withMessage("must be chracter in firstname"),

  LASTNAME: body("lastname")
    .not()
    .custom((value) => !/\s/.test(value))
    .withMessage("No spaces are allowed lastname")
    .isAlpha()
    .withMessage("must be character in lastname"),

  EMAIL: body("email")
    .custom((value) => !/\s/.test(value))
    .withMessage("no space are allowed email")
    .isEmail()
    .withMessage("Invalid email format"),

  PASSWORD: body("password")
    .custom((value) => !/\s/.test(value))
    .withMessage("password Is Required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 4 characters long"),

  ROLE: body("role")
    .custom((value) => !/\s/.test(value))
    .withMessage("Role is required")
    .custom((value) => {
      const allowedRoles = ["Admin", "SuperAdmin", "User"];
      if (!allowedRoles.includes(value)) {
        throw new Error("Invalid role");
      }
      return true;
    }),
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


















/*const validateUser = [
  body("firstname")
    .not()
    .isEmpty()
    .withMessage("No spaces are allowed in the firstname")
    .isAlpha()
    .withMessage("must be character"),
  body("lastname")
    .custom((value) => !/\s/.test(value))
    .withMessage("No spaces are allowed in the lastname")
    .isAlpha()
    .withMessage("must be character"),
  body("email")
    .custom((value) => !/\s/.test(value))
    .withMessage("No spaces are allowed in the email")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
    
  body("role").notEmpty().withMessage("role is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateUser };
 */

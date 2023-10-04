const { validator } = require("../middleware/validation");
const Joi = require("joi");

module.exports.validationConstant = function (method) {
  const validateSchema = Joi.object({
    firstname: validator.FIRSTNAME,
    lastname: validator.LASTNAME,
    email: validator.EMAIL,
    password: validator.PASSWORD,
    confirm_Password: validator.CONFIRM_PASSWORD,
    role: validator.ROLE,
  });

  switch (method) {
    case "register":
      return (req, res, next) => {
        const { error } = validateSchema.validate(req.body);
        if (error) {
          return res.status(400).json({
            status: "fail",
            message: error.details[0].message,
          });
        }
        next();
      };

    case "login":
      return (req, res, next) => {
        const { error } = Joi.object({
          email: validator.EMAIL,
          password: validator.PASSWORD,
        }).validate(req.body);

        if (error) {
          return res.status(400).json({
            status: "fail",
            message: error.details[0].message,
          });
        }
        next();
      };

    case "update":
      return (req, res, next) => {
        const validateSchemaUpdate = Joi.object({
          firstname: validator.FIRSTNAME,
          lastname: validator.LASTNAME,
          // role: validator.ROLE,
        });

        const { error } = validateSchemaUpdate.validate(req.body);
        if (error) {
          return res.status(400).json({
            status: "fail",
            message: error.details[0].message,
          });
        }
        next();
      };

    default:
      throw new Error("Invalid validation method");
  }
};

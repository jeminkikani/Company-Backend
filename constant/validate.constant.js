const { validator } = require("../middlware/validation");

module.exports.validationConstant = function (method) {
  const checkMissingFields = (req, res, next) => {
    const requiredFields = ["firstname","lastname","email","password","confirm_Password","role",];
    const missingFields = requiredFields.filter(
      (field) => !req.body.hasOwnProperty(field)
    );
    const extraFields = Object.keys(req.body).filter(
      (field) => !requiredFields.includes(field)
    );

    if (missingFields.length > 0 || extraFields.length > 0) {
      const errorFields = [];
      if (missingFields.length > 0) {
        errorFields.push(
          `Missing required fields: ${missingFields.join(", ")}`
        );
      }
      if (extraFields.length > 0) {
        errorFields.push(
          `Extra fields is not Valid: ${extraFields.join(", ")}`
        );
      }

      return res.status(400).json({
        status: "fail",
        message: errorFields.join(" and "),
      });
    }

    next();
  };

  const validateUpdate = (req, res, next) => {
    const validateFields = ["firstname", "lastname"];
    const newFields = Object.keys(req.body).filter(
      (field) => !validateFields.includes(field)
    );

    if (newFields.length > 0) {
      const errorFields = [];
      if (newFields.length > 0) {
        errorFields.push(`Extra fields are not valid: ${newFields.join(", ")}`);
      }
      return res.status(400).json({
        status: "fail",
        message: errorFields.join(" and "),
      });
    }

    next();
  };

  switch (method) {
    case "register":
      // console.log('register');
      return [
        validator.FIRSTNAME,
        validator.LASTNAME,
        validator.EMAIL,
        validator.PASSWORD,
        validator.ROLE,
        checkMissingFields,
      ];
    case "login":
      return [validator.EMAIL, validator.PASSWORD];
    case "update":
      return [
        validator.FIRSTNAME,
        validator.LASTNAME,
        validator.ROLE,
        validateUpdate,
      ];
  }
};

require("dotenv").config({ path: "./config/.env" });
const User = require("../models/user.model");
const Token = require('../models/token.model')
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;

const IsVerify = (actionRole) => async (req, res, next) => {
  const auth = req.headers["authorization"];
  if (!auth) {
    return res.json(402).json({
      status: "Fail",
      msg: "token is not provide",
    });
  }

  const token = auth.split(" ")[1];
  jwt.verify(token, secret, async (error, userId) => {
    try {
      const tokenData = await Token.findOne({ token, isActive: true });
      if (!tokenData && error) {
        return res.status(403).json({
          status: "Fail",
          message: "Token is expired",
        });
      }

      req.user = {
        ...userId,
        role: userId.role,
        company_id: userId.company_id,
      };
      // console.log(req.user);
      // console.log(']]]]]]]]]]]]]]]]]]]]]]]]]]',req.user)

      // console.log(req.user.role);
      if (req.user.role !== actionRole) {
        return res.status(403).json({
          status: "Fail",
          message: "they Route Is Only Use For Admin",
        });
      }
      next();
    } catch (error) {
      return res.status(403).json({
        status: "Fail",
        message: "Token is error",
      });
    }
  });
};


module.exports = { IsVerify };

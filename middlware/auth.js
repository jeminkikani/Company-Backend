require("dotenv").config({ path: "./config/.env" });
const User = require("../models/user.model");
const Token = require('../models/token.model')
const jwt = require("jsonwebtoken");
const secrate = process.env.SECRET_KEY;

const isveryfy = (actionRole) => async (req, res, next) => {
  const auth = req.headers["authorization"];
  if (!auth) {
    return res.json(402).json({
      status: "Fail",
      msg: "token is not provide",
    });
  }

  const token = auth.split(" ")[1];
  jwt.verify(token, secrate, async (error, userId) => {
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
      };
      // console.log(req.user.role);
      // console.log(req.user);

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


module.exports = { isveryfy };

/*// require("dotenv").config({ path: './config/.env' });
const jwt = require('jsonwebtoken');

const checkToken = async (req, res, next) => {
  let token = req.headers["authorization"];
  if(!token) {
    return res.status(401).json({
      status:"Fail",
      message:"Authontication Fail"
    })
  }
  let isToken = token.split(" ")[1];
  jwt.verify(isToken,process.env.PRIVET_KEY,(error,userdata) => {
    if(error) {
      res.status(400).json({
        status:"Fail",
        message:"JWT Expired"
      })
    }
    req.userdata = userdata;
    next();
  })
};

module.exports = {
  checkToken
};
 */

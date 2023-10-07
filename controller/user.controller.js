const User = require("../models/user.model");
const Token = require("../models/token.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, confirm_Password, role } =
      req.body;

    // Check for spaces in the fields
    if (
      firstname.includes(" ") ||
      lastname.includes(" ") ||
      email.includes(" ")
    ) {
      return res.status(400).json({
        status: "fail",
        message: "Spaces are not allowed in firstname, lastname, or email",
      });
    }
    if (password === confirm_Password) {
      const user = await User.findOne({ email });
      if (user) {
        return res
          .status(403)
          .json({ status: "Fail", message: "User is already exist" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        firstname,
        lastname,
        email,
        password: hashPassword,
        role,
        company_id: null,
      });

      const user1 = await User.findById(newUser.id).select("-password");

      const payload = {
        id: newUser._id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        company_id: null,
      };

      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "20d",
      });

      const newToken = new Token({
        user_id: newUser._id,
        token,
      });

      await newToken.save();

      await newUser.save();
      res.status(201).json({
        status: "success",
        message: "user created successfully",
        data: user1,
        token: token,
      });
    } else {
      return res.status(400).json({
        status: "Fail",
        message: "password and confirm_password is not match",
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ status: "Fail", message: "something wen wrong", data: error });
  }
};

// login-user
exports.loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(403)
        .json({ status: "Fail", message: "user not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(403)
        .json({ status: "Fail", message: "user password is incorrect" });
    }

    const existingToken = await Token.findOneAndUpdate(
      { user_id: user._id, isActive: true },
      { $set: { isActive: false } }
    );

    if (!existingToken) {
      return res.status(403).json({
        status: "Fail",
        message: "user Is Login",
      });
    }

    const payload = {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      password: user.password,
      role: user.role,
      company_id: user.company_id,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "20d",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_KEY, {
      expiresIn: "25d",
    });

    const newToken = new Token({
      user_id: user._id,
      token,
    });

    await newToken.save();

    res.status(201).json({
      status: "success",
      message: "user Is Login",
      data: newToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ status: "Fail", message: "something went wrong", data: error });
  }
};

// refresh-token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.json(402).json({
        status: "Fail",
        message: "token is not provide",
      });
    }
    const decode = jwt.verify(refreshToken, process.env.REFRESH_KEY);

    const user = await User.findById(decode.id);

    const payload = {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      password: user.password,
      role: user.role,
      company_id: user.company_id,
    };
    const accessToken = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "2h",
    });

    const newToken = await Token.findOneAndUpdate(
      { user_id: user._id },
      { token: accessToken },
      { new: true } // Return the updated document
    );

    res.status(201).json({
      status: "success",
      message: "accessToken successfully",
      data: newToken,
    });
  } catch (error) {
    return res.status(403).json({
      status: "Fail",
      message: "Token is Invalid",
    });
  }
};

// get-user
exports.user_info = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res
        .status(403)
        .json({ status: "Fail", message: "user not found" });
    }
    res.status(201).json({
      status: "success",
      message: "user Form successfully",
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: "something went wrong",
      data: error.message,
    });
  }
};

// get-all-user
exports.listUser = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(403).json({ message: "users not found" });
    }
    res.status(200).json({
      status: "success",
      message: "user Fetch successfully",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ status: "Fail", message: "something wen wrong", data: error });
  }
};

// update user
exports.updateuser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(403)
        .json({ status: "Fail", message: "user is not found" });
    }
    const updateuser = await User.findByIdAndUpdate(
      user._id,
      { $set: { ...req.body } },
      { new: true }
    ).select("-password");
    updateuser.save();
    res.status(200).json({
      status: "Success",
      message: "update user successfully",
      data: updateuser,
    });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ status: "Fail", message: "something wen wrong", data: error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res
        .status(403)
        .json({ status: "Fail", message: "user not found" });
    }
    const deleteUser = await User.findByIdAndDelete(userId);
    res.status(200).json({
      status: "Success",
      // data: {},
      message: "delete user successfully",
    });
  } catch (error) {
    res.json({ status: "Fail", data: error, message: "something went wrong" });
  }
};

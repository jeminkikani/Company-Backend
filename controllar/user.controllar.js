const User = require("../models/user.model");
const Token = require("../models/token.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, confirm_Password, role } =
      req.body;

    // console.log(password);
    // console.log(confirm_Password);

    if (password === confirm_Password) {
      const user = await User.findOne({ email });
      if (user) {
        return res.json({ msg: "User is already exist...." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const newuser = await User.create({
        firstname,
        lastname,
        email,
        password: hashPassword,
        role,
        company_id: null,
      });

      const payload = {
        id: newuser._id,
        firstname: newuser.firstname,
        lastname: newuser.lastname,
        email: newuser.email,
        password: newuser.password,
        role: newuser.role,
      };
      // console.log(payload);

      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "20d",
      });

      const newToken = new Token({
        user_id: newuser._id,
        token,
      });

      await newToken.save();

      await newuser.save();
      res.status(201).json({
        sttus: "Sucess",
        message: "user created sucessfully",
        data: newuser,
        token: token,
      });
    } else {
      return res.status(400).json({
        sttus: "Fail",
        message: "password and confirm_password is not match",
        //   data: error,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ status: "Fail", message: "something wen wrong", data: error });
  }
};

// login-user
exports.loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // console.log(email);
    // console.log(password);

    if (!user) {
      return res.json({ msg: "user not found..." });
    }
    const ismatch = await bcrypt.compare(password, user.password);
    // console.log(ismatch);
    if (!ismatch) {
      return res.json({ msg: "user password is incorrect...." });
    }

    const existingToken = await Token.findOneAndUpdate(
      { user_id: user._id, isActive: true },
      { $set: { isActive: false } }
    );

    if (!existingToken) {
      return res.json({
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
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "20d",
    });

    const newToken = new Token({
      user_id: user._id,
      token,
    });

    await newToken.save();

    res.status(201).json({
      status: "Sucess",
      message: "user Is Login",
      data: newToken,
    });
  } catch (error) {
    console.log(error);
    res.json({ sttus: "Fail", message: "something went wrong", data: error });
  }
};

// get-user
exports.getuser = async (req, res) => {
  try {
    // console.log(req.user);
    const user = await User.findById(req.user._id).select("-password");
    // console.log(user);
    if (!user) {
      return res.json({ msg: "user not found..." });
    }
    res.status(201).json({
      status: "Sucess",
      message: "user Fetch sucessfully",
      data: user,
    });
  } catch (error) {
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>", error);
    res.status(404).json({
      status: "Fail",
      message: "something went wrong",
      data: error.message,
    });
  }
};

// get-all-user
exports.getallUser = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.json({ msg: "users not found..." });
    }
    res.status(200).json({
      status: "Sucess",
      message: "user Fetch sucessfully",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "Fail", message: "something wen wrong", data: error });
  }
};

// update user
exports.updateuser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.json({ msg: "user is not found...." });
    }
    const updateuser = await User.findByIdAndUpdate(
      user._id,
      { $set: { ...req.body } },
      { new: true }
    );
    updateuser.save();
    res.status(200).json({
      status: "Success",
      data: updateuser,
      msg: "update user Sucessfully..",
    });
  } catch (error) {
    console.log(error);
    res.json({ sttus: "Fail", message: "something wen wrong", data: error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = User.findOneAndDelete({ user: User._id });
    if (!user) {
      return res.json({ msg: "user not found..." });
    }
    res
      .status(204)
      .json({ status: "Success", data: {}, msg: "delete user Sucessfully.." });
  } catch (error) {
    console.log(error);
    res.json({ sttus: "Fail", message: "something wen wrong", data: error });
  }
};

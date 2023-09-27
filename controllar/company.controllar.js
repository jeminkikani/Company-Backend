const Company = require("../models/company.model");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

exports.create_comapny = async (req, res) => {
  try {
    console.log(req.user);
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.json({ msg: "user is not found...." });
    }

      const { register_no, company_name, company_address, contact_no } = req.body;

      const isExistCompanyNo = await Company.findOne({ register_no });
    if (isExistCompanyNo) {
      return res.json({
        sttus: "Fail",
        msg: "this register_no filed is not allow for dupicate number",
      });
    }
  
    // console.log(req.user._id);
    const newCompany = new Company({
      register_no,
      company_name,
      company_address,
      contact_no,
    });
    //  console.log(newCompany);
    await newCompany.save();
    
    const userId = req.user.id;
    await User.findByIdAndUpdate(userId, { company_id: newCompany._id });

    return res.status(200).json({
      ststus: "Success",
      msg: "company is created...",
    });
  } catch (error) {
    console.error("Error creating comapny:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// view comapny
exports.view_company = async (req,res) =>{
  try {

     const userId = req.user._id;
     const users = await User.find( userId  ).populate("company_id");
    //  console.log(users)
     res.json(users);
    
  } catch (error) {
    console.error("Error view comapny:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

// update company
exports.update_company = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.json({ msg: "user is not found...." });
    }
    // { $set: { ...req.body } }
    const companyId = user.company_id;;

      const updatedCompany = await Company.findByIdAndUpdate(
        companyId,
        { $set: { ...req.body } },
        { new: true }
      );
      // console.log(updatedCompany);

    if (!updatedCompany) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.status(202).json({
      status: "Success",
      data: updatedCompany,
      msg: "update company Sucessfully..",
    });
  } catch (error) {
    console.log(error);
    res.json({ sttus: "Fail", message: "something wen wrong", data: error });
  }
};

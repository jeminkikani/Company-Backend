const Location = require('../models/location.model')
const User = require('../models/user.model')

exports.createLocation = async (req,res)=>{
    try {
      const { building, floor, room, description, company_id } = req.body;
      const userId = req.user.id;
      if (!userId) {
        return res.status(400).json({
          status: "Fail",
          message: "user is not found",
        });
      }

      const userCompanyId = req.user.company_id;
      if (!userCompanyId) {
        return res.status(400).json({
          status: "Fail",
          message: "companyId is not Exist",
        });
      }

      const isExist = await Location.findOne({
        building,
        floor,
        room,
        userCompanyId,  
      });
      if(isExist){
        return res.status(500).json({
          status: "Fail",
          message: "Location is already exists.",
        });
      }

      const newLocation = new Location({
        building,
        floor,
        room,
        description,
        company_id: userCompanyId,
      });

      await newLocation.save();

      res.status(201).json({
        status: "Success",
        message: "New Location Added",
        data: newLocation,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res
        .status(500)
        .json({ status: "Fail", message: "Internal Server Error" });
    }
}

exports.updateLocation = async (req, res) => {
  try {
    const locationId = req.params.id;

    const isExistLocation = await Location.findById(locationId);
    if (!isExistLocation) {
      return res
        .status(400)
        .json({ status: "Fail", message: "Location is not exists." });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        status: "Fail",
        message: "user is not found",
      });
    }

    const updateFields = { ...req.body };

    const updateLocation = await Location.findByIdAndUpdate(
      locationId,
      updateFields,
      { new:true }
    );

    if (!updateLocation) {
      return res
        .status(404)
        .json({ status: "Fail", message: "Location not found" });
    }
    res.status(200).json({
      status: "Success",
      message: "Category update successfully",
      data: updateLocation,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: "something went wrong",
      data: error.message,
    });
  }
};

exports.viewLocation = async (req, res) => {
    try {
      const LocationId = req.params.id;
      const user = await User.findById(req.user.id);
      if (!user) {
        return res
          .status(404)
          .json({ status: "Fail", message: "user is not found" });
      }

      const location = await Location.findById(LocationId);
      if (!location) {
        return res
          .status(404)
          .json({ status: "Fail", message: "Location is not found" });
      }

      res.status(201).json({
        status: "success",
        message: "category Fetch successfully",
        data: location,
      });
    } catch (error) {
      res.status(404).json({
        status: "Fail",
        message: "something went wrong",
        data: error.message,
      });
    }
};

exports.deleteLocation = async (req, res) => {
    try {
      const LocationId = req.params.id;
      if (!LocationId) {
        return res
          .status(404)
          .json({ status: "Fail", message: "Location is not found" });
      }
      const isExistLocation = await Location.findById(LocationId);
      console.log(isExistLocation);
      if (!isExistLocation) {
        return res
          .status(400)
          .json({ status: "Fail", message: "Location is not exists." });
      }
      const locations = await Location.findByIdAndDelete(LocationId);
      res.status(200).json({
        status: "Success",
        message: "delete Location successfully",
        data: {},
      });
    } catch (error) {
      console.log(error);
      res
        .status(404)
        .json({ status: "Fail", message: "something went wrong", data: error });
    }
};

exports.listLocation = async (req, res) => {
    try {
      const location = await Location.find();
      if (!location) {
        return res
          .status(404)
          .json({ status: "Fail", message: "Category is not found" });
      }
      res.status(200).json({
        status: "success",
        message: "Category Fetch successfully",
        data: location,
      });
    } catch (error) {
      console.log(error);
      res
        .status(404)
        .json({ status: "Fail", message: "something wen wrong", data: error });
    }
};
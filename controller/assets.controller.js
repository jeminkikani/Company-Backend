const Assets = require("../models/assets.model");
const User = require("../models/user.model");

// createAssets
exports.createAssets = async(req,res)=>{
    try {
      const { Name, AssetsNo, DepMethod, serialNo, visibility, purchaseOrder, dimensions, voltage, current, gasRequired, personal, serviceCost, status, cost, useFullLife, salvageValue, purchaseDate, inServiceDate, Notes, underService, emergencyPower, exhaust, ups,
      alarm, network, bookable, approval, training, company_id, vendor_id , product_id , location_id } = req.body;
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
          message: "category is not create for this User",
        });
      }

      const isExistAssets = await Assets.findOne({ Name });
      if (isExistAssets) {
        return res.status(400).json({
          status: "Fail",
          message: "Assets Name is already exists.",
        });
      }

      const newAssets = new Assets({
        AssetsNo,
        DepMethod,
        serialNo,
        visibility,
        purchaseOrder,
        dimensions,
        voltage,
        current,
        gasRequired,
        personal,
        serviceCost,
        status,
        cost,
        useFullLife,
        salvageValue,
        purchaseDate,
        inServiceDate,
        Notes,
        underService,
        emergencyPower,
        exhaust,
        ups,
        alarm,
        network,
        bookable,
        approval,
        training,
        company_id: userCompanyId,
        vendor_id,
        product_id,
        location_id
      });

      await newAssets.save();

      res
        .status(201)
        .json({
          status: "Success",
          message: "New Category Added",
          data: newAssets,
        });
    } catch (error) {
      console.error("Error creating user:", error);
      res
        .status(500)
        .json({ status: "Fail", message: "Internal Server Error" });
    }
};

exports.viewAssets = async (req, res) => {};

exports.updateAssets = async (req, res) => {};

exports.deleteAssets = async (req, res) => {};

exports.listAssets = async (req, res) => {};
const mongoose = require("mongoose");

const assetsSchemas = mongoose.Schema(
  {
    Name: {
      type: String,
      require: true,
    },
    AssetsNo: {
      type: Number,
      require: true,
    },
    DepMethod: {
      type: String,
      enum: [
        "straightLine",
        "decliningBalance",
        "sumOfYearDigits",
        "unitOfProduction",
      ],
      default: "straightLine",
    },
    serialNo: {
      type: String,
    },
    visibility: {
      type: String,
      enum: ["Public", "Private"],
    },
    purchaseOrder: {
      type: Number,
    },
    dimensions: {
      type: String,
    },
    voltage: {
      type: String,
    },
    current: {
      type: String,
    },
    gasRequired: {
      type: String,
    },
    personal: {
      type: String,
    },
    serviceCost: {
      type: String,
    },
    status: {
      type: String,
    },
    cost: {
      type: String,
    },
    useFullLife: {
      type: String,
    },
    salvageValue: {
      type: String,
    },
    purchaseDate: {
      type: String,
    },
    inServiceDate: {
      type: String,
    },
    Notes: {
      type: String,
    },
    underService: {
      type: Boolean,
    },
    emergencyPower: {
      type: Boolean,
    },
    exhaust: {
      type: Boolean,
    },
    ups: {
      type: Boolean,
    },
    alarm: {
      type: Boolean,
    },
    network: {
      type: Boolean,
    },
    bookable: {
      type: Boolean,
    },
    approval: {
      type: Boolean,
    },
    training: {
      type: Boolean,
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    location_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assets", assetsSchemas);

const mongoose = require("mongoose");

const productSchemas = mongoose.Schema(
  {
    Name: {
      type: String,
      require: true,
      trim: true,
    },
    model: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    Notes: {
      type: String,
      require: true,
      trim: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchemas);

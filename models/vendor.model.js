const mongoose = require("mongoose");

const vendorSchemas = mongoose.Schema(
  {
    Name: {
        type: String,
        require: true,
        trim: true
    },
    description: {
        type: String,
        require: true,
    },
    website:{
        type:String,
        require:true
    },
    Notes:{
        type:String,
        require:true,
        trim:true
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchemas);

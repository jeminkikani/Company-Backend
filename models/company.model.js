const mongoose = require("mongoose");

const companySchema = mongoose.Schema(
  {
    register_no: {
      type: Number,
    },
    company_name: {
      type: String,
      
    },
    company_address: {
      type: String,
    
    },
    contact_no:{
        type:Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);

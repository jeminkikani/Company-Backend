const mongoose = require("mongoose");

const companySchema = mongoose.Schema(
  {
    register_no: {
      type: Number,
      require:true
    },
    company_name: {
      type: String,
      require:true
      
    },
    company_address: {
      type: String,
      require:true
    
    },
    contact_no:{
        type:Number,
        min: 10,
        require:true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);

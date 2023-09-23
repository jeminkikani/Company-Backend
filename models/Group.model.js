const mongoose = require("mongoose");

const insertSchemas = mongoose.Schema(
  {
    Name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
    },
    company_id:{
      type: mongoose.Schema.Types.ObjectId,
      ref:'User'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", insertSchemas);

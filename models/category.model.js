const mongoose = require("mongoose");

const categorySchemas = mongoose.Schema(
  {
    Name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchemas);

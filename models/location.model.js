const mongoose = require("mongoose");

const locationSchemas = mongoose.Schema(
  {
    building: {
      type: String,
      require: true,
    },
    floor: {
      type: String,
      require: true,
    },
    room: {
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

module.exports = mongoose.model("Location", locationSchemas);

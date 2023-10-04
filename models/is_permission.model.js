const mongoose = require("mongoose");

const ispermissionSchema = mongoose.Schema(
  {
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    role: {
      type: String,
      enum: ["SuperAdmin", "Admin", "User"],
    },
    route: {
      type: String,
      enum: [
        "createGroup",
        "updateGroup",
        "listGroup",
        "viewGroup",
        "deleteGroup",
      ],
    },
    isPermission: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ispermission", ispermissionSchema);

const mongoose = require("mongoose");

const ispermissionSchema = mongoose.Schema(
  {
    ispermission_id: {
      type: String,
      default: 1,
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

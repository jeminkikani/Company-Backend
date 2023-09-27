const mongoose = require("mongoose");

const groupUserSchemas = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    group_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    groupUserRole: {
      type: String,
      default: 'groupAdmin',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GroupUser", groupUserSchemas);

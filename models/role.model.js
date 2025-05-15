const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    permissions: { // nhóm quyền
      type: Array,
      default: []
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date,
  }, 
  {
    timestamps: true,
  }
);

const Role = mongoose.model('Role', roleSchema, "roles"); // Tham số thứ 3 là Collection

module.exports = Role;

const mongoose = require("mongoose");
const generateHelper = require("../helpers/generate");

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    tokenUser: { // là 1 String random (Duy nhất và chỉ có user biết được)
      type: String,
      default: generateHelper.generateRandomString(20)
    }, 
    phone: String,
    avatar: String,
    // role_id: String,
    status: {
      type: String,
      default: "active"
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

const User = mongoose.model('User', userSchema, "users"); // Tham số thứ 3 là Collection

module.exports = User;
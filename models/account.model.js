const mongoose = require("mongoose");
const generateHelper = require("../helpers/generate");

const accountSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    token: { // là 1 String random (Duy nhất và chỉ có user biết được)
      type: String,
      default: generateHelper.generateRandomString(20)
    }, 
    avatar: String,
    role_id: String,
    status: String,
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

const Account = mongoose.model('Account', accountSchema, "accounts"); // Tham số thứ 3 là Collection

module.exports = Account;

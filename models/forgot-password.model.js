const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    expireAt: {
      type: Date,
      expires: 180 // Document sẽ tự động bị xóa sau 180s
    }
  }, 
  {
    timestamps: true,
  }
);

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema, "forgot-password"); // Tham số thứ 3 là Collection

module.exports = ForgotPassword;
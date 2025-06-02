// Collection này chỉ có 1 document duy nhất
const mongoose = require("mongoose");

const settingGeneralSchema = new mongoose.Schema(
  {
    websiteName: String,
    logo: String,
    phone: String,
    email: String,
    address: String,
    copyright: String,
    //facebook, zalo...
  }, 
  {
    timestamps: true,
  }
);

const SettingGeneral = mongoose.model('SettingGeneral', settingGeneralSchema, "settings-general"); // Tham số thứ 3 là Collection

module.exports = SettingGeneral;
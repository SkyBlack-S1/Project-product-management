const SettingGeneral = require("../../models/settings-general.model");

// [GET] /admin/settings/general
module.exports.general = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({}); // Tự động lấy ra document đầu tiên
  res.render("admin/pages/settings/general", {
    pageTitle: "Cài đặt chung",
    // settingGeneral: settingGeneral
  });
}

// [PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});
  if(settingGeneral) { // Có rồi thì cập nhật
    await SettingGeneral.updateOne({
      _id: settingGeneral.id
    },req.body);
  } else { // chưa có thì tạo mới
    const record = new SettingGeneral(req.body);
    await record.save();
  }

  res.redirect(req.header("Referer"));
}
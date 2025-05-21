const Account = require("../../models/account.model");
const md5 = require("md5");

// [GET] /admin/my-account
module.exports.index = (req, res) => {
  res.render("admin/pages/my-account/index", {
    pageTitle: "Thông tin cá nhân",
  });
};

// [GET] /admin/my-account/edit
module.exports.edit = (req, res) => {
  res.render("admin/pages/my-account/edit", {
    pageTitle: "Chỉnh sửa thông tin cá nhân",
  });
};

// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
  const id = res.locals.user.id;
  
  const emailExist = await Account.findOne({
    _id: { $ne: id }, // ngoại trừ id này ra (để tránh đi vào if khi user không thay đổi email)
    email: req.body.email,
    deleted: false,
  });

  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại!`);
  } else {
    if (req.body.password) {
      // Nếu user có đổi mật khẩu
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password; // Nếu user không đổi mật khẩu -> password = ''
    }

    await Account.updateOne({ _id: id }, req.body);

    req.flash("success", "Cập nhật tài khoản thành công!");
  }
  res.redirect(req.header("Referer"));
};

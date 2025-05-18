const Account = require("../../models/account.model");
const md5 = require("md5");
const systemConfig = require("../../config/system");

// [GET] /admin/auth/login
module.exports.login = (req, res) => {
  if (req.cookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`); // Nếu đã đăng nhập thành công, mà vẫn truy cập vào trang đăng nhập thì sẽ bị chuyển sang trang tổng quan
  } else {
    res.render("admin/pages/auth/login", {
      pageTitle: "Đăng nhập",
    });
  }
};

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await Account.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", "Email không tồn tại");
    res.redirect(req.header("Referer"));
    return;
  }

  if (md5(password) != user.password) {
    req.flash("error", "Sai mật khẩu!");
    res.redirect(req.header("Referer"));
    return;
  }

  if (user.status == "inactive") {
    req.flash("error", "Tài khoản đã bị khóa!");
    res.redirect(req.header("Referer"));
    return;
  }

  res.cookie("token", user.token);
  res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
};

// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
  // Xóa token trong cookies
  res.clearCookie("token");
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
};

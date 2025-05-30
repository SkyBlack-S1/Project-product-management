const User = require("../../models/users.model");
const ForgotPassword = require("../../models/forgot-password.model");
const md5 = require("md5");
const generateHelper = require("../../helpers/generate");

// [GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  });
};


// [POST] /user/registerPost
module.exports.registerPost = async (req, res) => {
  const existEmail = await User.findOne({
    email: req.body.email
  });
  
  if(existEmail) {
    req.flash("error", "Email đã tồn tại!");
    res.redirect(req.header("Referer"));
    return;
  }

  req.body.password = md5(req.body.password);

  const user = new User(req.body);
  await user.save();

  res.cookie("tokenUser", user.tokenUser); // Đăng ký thành công sẽ Đăng nhập thành công luôn

  res.redirect("/");
};


// [GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập tài khoản",
  });
};


// [POST] /user/loginPost
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    email: email,
    deleted: false
  });

  if(!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect(req.header("Referer"));
    return;
  }

  if(md5(password) !== user.password) {
    req.flash("error", "Sai mật khẩu!");
    res.redirect(req.header("Referer"));
    return;
  }

  if(user.status === "inactive") {
    req.flash("error", "Tài khoản đang bị khóa!");
    res.redirect(req.header("Referer"));
    return;
  }

  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/");
};


// [GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect("/");
};


// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Lấy lại mật khẩu",
  });
};


// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;
  
  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if(!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect(req.header("Referer"));
    return;
  }

  // Lưu thông tin vào DB
  const otp = generateHelper.generateRandomNumber(8);
  
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now()
  };

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  // Nếu tồn tại email thì gửi mã OTP qua email

  res.send("ok");
};
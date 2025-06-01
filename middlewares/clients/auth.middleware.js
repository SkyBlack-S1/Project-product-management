const User = require("../../models/users.model");

module.exports.requireAuth = async (req, res, next) => {
  if(!req.cookies.tokenUser){
    res.redirect(`/user/login`);
  } else {
    const user = await User.findOne({ tokenUser: req.cookies.tokenUser }).select("-password");
    if(!user) {
      res.redirect(`/user/login`);
    } else { // Đăng nhập thành công
      res.locals.user = user;
      next();
    }
  }
};
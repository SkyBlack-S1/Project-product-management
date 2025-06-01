const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/user.controller");
const validate = require("../../validates/client/user.validate");

// Đăng ký
router.get("/register", controller.register);

router.post(
  "/register", 
  validate.registerPost,
  controller.registerPost
);

// Đăng nhập
router.get("/login", controller.login);

router.post(
  "/login", 
  validate.loginPost,
  controller.loginPost
);

// Đăng xuất
router.get("/logout", controller.logout);

// Quên mật khẩu
router.get("/password/forgot", controller.forgotPassword);

router.post(
  "/password/forgot", 
  validate.forgotPasswordPost,
  controller.forgotPasswordPost
);

router.get("/password/otp", controller.otpPassword);

router.post("/password/otp", controller.otpPasswordPost);

router.get("/password/reset", controller.resetPassword);

router.post(
  "/password/reset", 
  validate.resetPasswordPost,
  controller.resetPasswordPost
);

module.exports = router;
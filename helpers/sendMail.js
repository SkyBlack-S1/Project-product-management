const nodemailer = require("nodemailer");

module.exports.sendMail = (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMALI_USER,
      pass: process.env.EMAIL_PASSWORD, // Đây là "Mật khẩu ứng dụng" không phải mật khẩu Gmail
    }
  });

  const mailOptions = {
    from: process.env.EMALI_USER,
    to: email,
    subject: subject,
    html: html, // Key phải tên "html" mới đọc được mã HTML
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
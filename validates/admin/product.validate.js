module.exports.createPost = (req, res, next) => {
  if(!req.body.title) {
    req.flash("error", "Vui lòng nhập tiêu đề!");
    res.redirect(req.header('Referer')); // quay lại trang trước đó
    return; // bỏ qua các đoạn code bên dưới
  }
  
  next(); // chuyển quyền xử lý cho middleware tiếp theo (controller.createPost), tức là chuyển sang bước tiếp theo
}
module.exports.createPost = (req, res, next) => {
  if(!req.body.title) {
    req.flash("error", "Vui lòng nhập tiêu đề của danh mục!");
    res.redirect(req.header('Referer'));
    return;
  }
  
  next();
}
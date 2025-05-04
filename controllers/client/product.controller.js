module.exports.index = (req, res) => { // index là tên hàm thể hiện trang chính của "trang sản phẩm"
  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm"
  });
}
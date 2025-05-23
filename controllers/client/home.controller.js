const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

// [GET] /
module.exports.index = async (req, res) => { // index là tên hàm thể hiện "trang chính" của trang chủ (home)
  // Lấy ra sp nổi bật
  const productsFeatured = await Product.find({
    deleted: false,
    featured: "1",
    status: "active"
  }).limit(6);
  const newProducts = productsHelper.priceNewProduct(productsFeatured);
  // End Lấy ra sp nổi bật
  

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: newProducts
  }); 
}
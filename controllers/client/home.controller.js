const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

// [GET] /
module.exports.index = async (req, res) => { // index là tên hàm thể hiện "trang chính" của trang chủ (home)
  // Lấy ra DS sp nổi bật
  const productsFeatured = await Product.find({
    deleted: false,
    featured: "1",
    status: "active"
  }).limit(6);
  const newProductsFeatured = productsHelper.priceNewProduct(productsFeatured);
  // End Lấy ra DS sp nổi bật

  // Lấy ra DS sp mới nhất
  const productsNew = await Product.find({
    deleted: false,
    status: "active"
  }).sort({position: "desc"}).limit(6);
  const newProductsNew = productsHelper.priceNewProduct(productsNew);
  // End Lấy ra DS sp mới nhất

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: newProductsFeatured,
    productsNew: newProductsNew
  }); 
}
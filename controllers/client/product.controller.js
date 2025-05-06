/* Controller : Xử lý logic, tính toán & liên kết model với view */
const Product = require("../../models/product.model");
// [GET] /products
module.exports.index = async (req, res) => { // index là tên hàm thể hiện trang chính của "trang sản phẩm"
  const products = await Product.find({ // Truy vấn tất cả document ở trong collection products
    status: "active",
    deleted: false
  }); 

  const newProducts = products.map(item => {
    item.priceNew = (item.price*(100 - 
    item.discountPercentage)/100).toFixed(0);
    return item;
  });

  console.log(newProducts);

  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: newProducts
  });
}
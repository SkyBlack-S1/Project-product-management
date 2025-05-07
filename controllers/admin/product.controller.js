const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filerStatus");

// [GET] /admin/products
module.exports.index = async (req, res) => {

  // Tính năng lọc theo trạng thái
  const filterStatus = filterStatusHelper(req.query);

  let find = {
    deleted: false
  };

  if(req.query.status){
    find.status = req.query.status; // tương tự việc thêm key status vào find, với value là "active"
  }

  // Tính năng tìm kiếm
  let keyword = "";
  if(req.query.keyword){
    keyword = req.query.keyword;
    const regex = new RegExp(keyword, "i");
    find.title = regex;
  }

  const products = await Product.find(find);
  // console.log(products);

  res.render("admin/pages/products/index", { // hiển thị ra views
    pageTitle: "Trang sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: keyword
  });
}
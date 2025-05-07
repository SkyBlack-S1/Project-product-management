const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filerStatus");
const searchHelper = require("../../helpers/search");
// [GET] /admin/products
module.exports.index = async (req, res) => {

  let find = {
    deleted: false
  };

  // Tính năng lọc theo trạng thái
  const filterStatus = filterStatusHelper(req.query);

  if(req.query.status){
    find.status = req.query.status; // tương tự việc thêm key status vào find, với value là "active"
  }

  // Tính năng tìm kiếm
  const objectSearch = searchHelper(req.query);
  if(objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // Tính năng phân trang
  let objectPagination = {
    currentPage: 1,
    limitItems: 4
  };

  if(req.query.page) {
    objectPagination.currentPage = parseInt(req.query.page);
  }

  objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;

  const countProducts = await Product.countDocuments(find);
  const totalPage = Math.ceil(countProducts/objectPagination.limitItems);
  // console.log(totalPage);
  objectPagination.totalPage = totalPage;

  const products = await Product.find(find)
  .limit(objectPagination.limitItems).skip(objectPagination.skip);
  // const products = await Product.find(find);

  res.render("admin/pages/products/index", { // hiển thị ra views
    pageTitle: "Trang sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination
  });
}
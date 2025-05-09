// [------------------- Xử lý phía BE -------------------] //
const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filerStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// [GET] /admin/products
module.exports.index = async (req, res) => {

  let find = {
    deleted: false // tức chưa bị xóa
  };

  /* Tính năng lọc theo trạng thái */
  const filterStatus = filterStatusHelper(req.query);

  if(req.query.status){
    find.status = req.query.status; // tương tự việc thêm key status vào find, với value là "active"
  }

  /* Tính năng tìm kiếm */
  const objectSearch = searchHelper(req.query);
  if(objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  /* Tính năng phân trang */
  const countProducts = await Product.countDocuments(find);

  let objectPagination = paginationHelper (
    {
      currentPage: 1,
      limitItems: 4
    },
    req.query,
    countProducts
  );
  /* End Tính năng phân trang */

  const products = await Product.find(find)
  .sort({ position: "desc"})
  .limit(objectPagination.limitItems).skip(objectPagination.skip);
  
  res.render("admin/pages/products/index", { // hiển thị ra views
    pageTitle: "Trang sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination
  });
}

/* Thay đổi trạng thái sản phẩm -> Update Database */
// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  
  await Product.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cập nhật trạng thái thành công!");

  const backURL = req.header('Referer'); // Chuyển hướng sang trang trước đó
  res.redirect(backURL);
}

/* Thay đổi trạng thái [nhiều] sản phẩm -> Update Database */
// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", "); // chuyển thành mảng
  switch (type) {
    case "active":
      await Product.updateMany( { _id: { $in: ids } }, { status: "active" } ); // chỉ dùng được khi nhiều sản phẩm (id) có cùng status
      req.flash("success", `Cập nhật thành công trạng thái của ${ids.length} sản phẩm!`);
      break;
    case "inactive":
      await Product.updateMany( { _id: { $in: ids } }, { status: "inactive" } );
      req.flash("success", `Cập nhật thành công trạng thái của ${ids.length} sản phẩm!`);
      break;
    
    case "delete-all":
      await Product.updateMany( { _id: { $in: ids } }, { 
        deleted: true, 
        deletedAt: new Date() 
      } );
      req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm!`);
      break;
    
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne( { _id: id }, { 
          position: position 
        } );
      }
      break;

    default:
      break;
  }
  const backURL = req.header('Referer');
  res.redirect(backURL);
}

/* Xóa 1 sản phẩm (Xóa vĩnh viễn (cứng) hoặc xóa mềm) */
// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  
  // await Product.deleteOne({ _id: id }); // xóa vĩnh viễn
  await Product.updateOne( // xóa mềm
    { _id: id }, 
    { deleted: true, deletedAt: new Date() }
  ); 

  req.flash("success", `Đã xóa thành công sản phẩm!`);

  const backURL = req.header('Referer');
  res.redirect(backURL);
}



/* Note
Truy vấn... -> Doc Mongoose
Cú pháp... -> Doc ExpressJS
- Đường dẫn
+ Truyền thằng đường dẫn khi không có biến động
+ Nối chuỗi khi có biến động (id, status...)
*/
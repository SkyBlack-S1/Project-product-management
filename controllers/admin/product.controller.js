// [------------------- Xử lý phía BE -------------------] //
const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filerStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/products
module.exports.index = async (req, res) => {
  let find = {
    deleted: false, // tức chưa bị xóa
  };

  /* Tính năng lọc theo trạng thái */
  const filterStatus = filterStatusHelper(req.query);

  if (req.query.status) {
    find.status = req.query.status; // tương tự việc thêm key status vào find, với value là "active"
  }

  /* Tính năng tìm kiếm */
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  /* Tính năng phân trang */
  const countProducts = await Product.countDocuments(find);

  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countProducts
  );
  /* End Tính năng phân trang */

  /* Sort SP theo các tiêu chí */
  let sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc"; // mặc định không yc gì thì sắp xếp theo vị trí giảm dần
  }
  /* End Sort SP theo các tiêu chí */

  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  for (const product of products) {
    // Lấy thông tin người tạo
    const user = await Account.findOne({ // Ở mỗi sp sẽ duyệt qua từng account để tìm xem account nào có id trùng với account_id
      _id: product.createdBy.account_id
    });

    if(user){
      product.accountFullName = user.fullName;
    }

    // Lấy thông tin người cập nhật gần đây nhất -> phần tử cuối cùng trong mảng
    // const updatedBy = product.updatedBy[product.updatedBy.length-1];
    const updatedBy = product.updatedBy.slice(-1)[0];
    if(updatedBy) {
      const userUpdated = await Account.findOne({ 
        _id: updatedBy.account_id
      });

      updatedBy.accountFullName = userUpdated.fullName;
    }
  }

  res.render("admin/pages/products/index", {
    // hiển thị ra views
    pageTitle: "Trang danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};


/* Thay đổi trạng thái sản phẩm -> Update Database */
// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }

  await Product.updateOne({ _id: id }, { 
    status: status,
    $push: { updatedBy: updatedBy } 
  });

  req.flash("success", "Cập nhật trạng thái thành công!");

  const backURL = req.header("Referer"); // Chuyển hướng sang trang trước đó
  res.redirect(backURL);
};


/* Thay đổi trạng thái [nhiều] sản phẩm -> Update Database */
// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", "); // chuyển thành mảng
  
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }
  
  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { 
        status: "active", 
        $push: { updatedBy: updatedBy } 
      }); // chỉ dùng được khi nhiều sản phẩm (id) có cùng status
      req.flash(
        "success",
        `Cập nhật thành công trạng thái của ${ids.length} sản phẩm!`
      );
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { 
        status: "inactive",
        $push: { updatedBy: updatedBy } 
      });
      req.flash(
        "success",
        `Cập nhật thành công trạng thái của ${ids.length} sản phẩm!`
      );
      break;

    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          // deletedAt: new Date(),
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(),
          }
        }
      );
      req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm!`);
      break;

    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne(
          { _id: id },
          {
            position: position,
            $push: { updatedBy: updatedBy }
          }
        );
      }
      req.flash(
        "success",
        `Đã đổi vị trí thành công của ${ids.length} sản phẩm!`
      );
      break;

    default:
      break;
  }
  const backURL = req.header("Referer");
  res.redirect(backURL);
};


/* Xóa 1 sản phẩm (Xóa vĩnh viễn (cứng) hoặc xóa mềm) */
// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  // await Product.deleteOne({ _id: id }); // xóa vĩnh viễn
  await Product.updateOne(
    // xóa mềm
    { _id: id },
    { 
      deleted: true, 
      // deletedAt: new Date() 
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date(),
      }
    }
  );

  req.flash("success", `Đã xóa thành công sản phẩm!`);

  const backURL = req.header("Referer");
  res.redirect(backURL);
};


/* ---------------- Thêm 1 sản phẩm ---------------- */
// [GET] /admin/products/create ( Lấy giao diện -> nhấn "+ Thêm mới" bên index.pug )
module.exports.create = async (req, res) => {
  const category = await ProductCategory.find({
    deleted: false,
  });
  const newCategory = createTreeHelper.tree(category);

  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
    category: newCategory,
  });
};

// [POST] /admin/products/create ( Khi submit -> nhấn "Tạo mới" )
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    // Tự động tăng
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    // Nhập thủ công
    req.body.position = parseInt(req.body.position);
  }

  req.body.createdBy = {
    account_id: res.locals.user.id
  };

  const product = new Product(req.body); // Tạo mới 1 sản phẩm
  await product.save(); // Lưu vào database

  res.redirect(`${systemConfig.prefixAdmin}/products`);
};
/* ---------------- End Thêm 1 sản phẩm ---------------- */


/* ---------------- Chỉnh sửa 1 sản phẩm ---------------- */
// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  // console.log(req.params.id);
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const product = await Product.findOne(find);

    const category = await ProductCategory.find({
      deleted: false,
    });
    const newCategory = createTreeHelper.tree(category);

    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      category: newCategory,
    });
  } catch (error) {
    req.flash("error", `Không tìm thấy sản phẩm!`);
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);

  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    }

    await Product.updateOne({ _id: id }, {
      ...req.body, // Update tất cả trừ trường updatedBy
      $push: { updatedBy: updatedBy } // Thêm vào chứ không ghi đè
    });
    req.flash("success", `Cập nhật thành công ${req.body.title}!`);
  } catch (error) {
    req.flash("error", `Cập nhật thất bại!`);
  }

  res.redirect(req.header("Referer"));
};
/* ---------------- End Chỉnh sửa 1 sản phẩm ---------------- */


/* ---------------- Chi tiết 1 sản phẩm ---------------- */
// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const product = await Product.findOne(find);

    console.log(product);

    res.render("admin/pages/products/detail", {
      pageTitle: `${product.title}`,
      product: product,
    });
  } catch (error) {
    req.flash("error", `Không tìm thấy sản phẩm!`);
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
/* ---------------- End Chi tiết 1 sản phẩm ---------------- */


/* Note
Truy vấn... -> Doc Mongoose
Cú pháp... -> Doc ExpressJS
- Đường dẫn
+ Truyền thằng đường dẫn khi không có biến động
+ Nối chuỗi khi có biến động (id, status...)
*/
const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");
const { permissions } = require("./role.controller");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(records);

  res.render("admin/pages/products-category/index", {
    pageTitle: "Trang danh mục sản phẩm",
    records: newRecords,
  });
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(records);

  // console.log(newRecords); // Lưu ý phải mở cửa sổ console phía BE bên trình duyệt mới xem đầy đủ

  res.render("admin/pages/products-category/create", {
    pageTitle: "Tạo danh mục sản phẩm",
    records: newRecords,
  });
};

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  const permissions = res.locals.role.permissions;

  if(permissions.includes("products-category_create")) {
    if (req.body.position == "") { // Tự động tăng
      const count = await ProductCategory.countDocuments();
      req.body.position = count + 1;
    } else { // Nhập thủ công
      req.body.position = parseInt(req.body.position);
    }
    
    const record = new ProductCategory(req.body); // Tạo mới 1 danh mục
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  
  } else {
    return;
  }
};

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await ProductCategory.findOne({
      _id: id,
      deleted: false,
    });

    const records = await ProductCategory.find({
      deleted: false,
    });
    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products-category/edit", {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      data: data,
      records: newRecords,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.position = parseInt(req.body.position);

  await ProductCategory.updateOne({ _id: id }, req.body);

  res.redirect(req.header("Referer"));
};


/* ---------------- Chi tiết 1 danh mục sản phẩm ---------------- */
// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const record = await ProductCategory.findOne(find);

    if(record.parent_id){
      const parent = await ProductCategory.findOne({deleted: false, _id: record.parent_id});
      record.titleParent = parent.title;
    }
    

    console.log(record);

    res.render("admin/pages/products-category/detail", {
      pageTitle: `${record.title}`,
      record: record,
    });

  } catch (error) {
    req.flash("error", `Không tìm thấy danh mục sản phẩm!`);
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};
/* ---------------- Chi tiết 1 danh mục sản phẩm ---------------- */
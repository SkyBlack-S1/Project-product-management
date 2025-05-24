/* Controller : Xử lý logic, tính toán & liên kết model với view */
const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const productsHelper = require("../../helpers/products");
const productsCategoryHelper = require("../../helpers/products-category");

// [GET] /products
module.exports.index = async (req, res) => {
  // index là tên hàm thể hiện trang chính của "trang sản phẩm"
  const products = await Product.find({
    // Truy vấn tất cả document ở trong collection products
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  const newProducts = productsHelper.priceNewProduct(products);

  res.render("client/pages/products/index", {
    pageTitle: "Trang sản phẩm",
    products: newProducts,
  });
};


/* ---------------- Chi tiết 1 sản phẩm cho Client ---------------- */
// [GET] /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slug,
      status: "active"
    };

    const product = await Product.findOne(find);

    // console.log(product);

    res.render("client/pages/products/detail", {
      pageTitle: `${product.title}`,
      product: product,
    });
  } catch (error) {
    res.redirect(`/products`);
  }
};
/* ---------------- End Chi tiết 1 sản phẩm cho Client ---------------- */


/* ---------------- Lấy ra các sản phẩm thuộc danh mục ----------------------- */
// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  // console.log(req.params.slugCategory);
  const category = await ProductCategory.findOne({
    slug: req.params.slugCategory,
    status: "active",
    deleted: false,
  });

  const listSubCategory = await productsCategoryHelper.getSubCategory(category.id);
  
  const listSubCategoryId = listSubCategory.map(item => item.id);

  const products = await Product.find({ // Khi click vào cha thì phải hiển thị ra DS SP của cha + DS SP của con, cháu...
    product_category_id: { $in: [
      category.id,
      ...listSubCategoryId,
    ]},
    deleted: false
  }).sort({position: "desc"});

  const newProducts = productsHelper.priceNewProduct(products);

  res.render("client/pages/products/index", {
    pageTitle: `${category.title}`,
    products: newProducts,
  });
};
/* ---------------- End Lấy ra các sản phẩm thuộc danh mục ----------------------- */
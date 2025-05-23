/* Controller : Xử lý logic, tính toán & liên kết model với view */
const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

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

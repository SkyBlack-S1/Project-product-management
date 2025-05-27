const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

// Trang giỏ hàng
// [GET] /cart/
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({
    _id: cartId
  });
  
  if(cart.products.length > 0) {
    for (const item of cart.products) {
      const productId = item.product_id;
      const productInfo = await Product.findOne({
        _id: productId,
      }).select("title thumbnail slug price discountPercentage");
      
      productInfo.priceNew = productsHelper.priceNewProduct(productInfo);
      
      item.productInfo = productInfo; // Thêm productsInfo vào mỗi item (Object) trong mảng cart.products
      
      item.totalPrice = productInfo.priceNew * item.quantity; // Tổng tiền của từng sản phẩm
    }
  }

  cart.totalPrices = cart.products.reduce((sum, item) => (sum + item.totalPrice), 0);

  // console.log(cart);

  res.render("client/pages/cart/index", {
    pageTitle: "Giỏ hàng",
    cartDetail: cart
  });
};


//-------------- Thêm sản phẩm vào giỏ hàng --------------//
// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  const cartId = req.cookies.cartId;
  // console.log(cartId);

  const cart = await Cart.findOne({
    _id: cartId
  });

  const existProductInCart = cart.products.find( // Đây là hàm find trong JS để tìm item trong mảng thỏa điều kiện
    item => item.product_id == productId
  );
  
  if(existProductInCart) { // Nếu đã có sp đó trong giỏ hàng thì chỉ cần tăng số lượng lên thôi
    const quantityNew = quantity + existProductInCart.quantity; // sl mới + sl cũ
    await Cart.updateOne(
      {
        _id: cartId,
        "products.product_id": productId
      },
      {
        $set: {
          "products.$.quantity": quantityNew
        }
      }
    );
  } else {
    const objectCart = {
      product_id: productId,
      quantity: quantity,
    };

    await Cart.updateOne(
      {
        _id: cartId
      },
      {
        $push: { products: objectCart }
      }
    );
  }
  
  req.flash("success", "Đã thêm sản phẩm vào giỏ hàng!");
  res.redirect(req.header("Referer"));
};
//-------------- End Thêm sản phẩm vào giỏ hàng --------------//


//------------- Xóa sản phẩm trong giỏ hàng -------------//
// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  
  await Cart.updateOne({
    _id:cartId
  }, {
    $pull: { products: { product_id: productId }}
  });

  req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng!");
  res.redirect(req.header("Referer"));
}
//------------- End Xóa sản phẩm trong giỏ hàng -------------//
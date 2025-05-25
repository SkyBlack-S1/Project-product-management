const Cart = require("../../models/cart.model");

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
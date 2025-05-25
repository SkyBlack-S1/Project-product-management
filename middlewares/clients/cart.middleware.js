const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
  if(!req.cookies.cartId) {
    const cart = new Cart();
    await cart.save();
    
    // Set thời gian hết hạn cho cookies
    const expiresCookie = 365*24*60*60*1000;
    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + expiresCookie)
    });
  } else {
    
  }
  
  next();
}
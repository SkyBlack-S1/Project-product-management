const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user_id: String,
    products: [
      {
        product_id: String,
        quantity: Number,
      }
    ]
  }, 
  {
    timestamps: true,
  }
);

const Cart = mongoose.model('Cart', cartSchema, "carts"); // Tham số thứ 3 là Collection

module.exports = Cart;
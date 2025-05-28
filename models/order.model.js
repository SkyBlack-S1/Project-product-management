const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // user_id: String, // Đã đăng nhập
    cart_id: String,
    userInfo: { // Chưa đăng nhập
      fullName: String,
      phone: String,
      address: String
    },
    products: [ // Cần mảng này vì : Khi đặt hàng thành công thì phải xóa mảng products trong collection "carts" | Giá sản phẩm sẽ thay đổi | Phục vụ cho việc phân tích và thống kê số liệu sau này
      {
        product_id: String,
        price: Number,
        discountPercentage: Number,
        quantity: Number,
      }
    ],
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date,
  }, 
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema, "orders"); // Tham số thứ 3 là Collection

module.exports = Order;
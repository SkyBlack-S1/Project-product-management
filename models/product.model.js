/* Lý do nên sử dụng Mongoose
Khi tạo mới SP sẽ tuân theo khung Schema này, nếu FE gửi các trường linh tinh thì DB sẽ không lưu
Nếu kết nối trực tiếp thì sẽ lưu hết những gì FE gửi lên
*/
const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    title: String,
    product_category_id: {
      type: String,
      default: ""
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    slug: { 
      type: String, 
      slug: "title",
      unique: true
    },
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

const Product = mongoose.model('Product', productSchema, "products"); // Tham số thứ 3 là Collection

module.exports = Product;

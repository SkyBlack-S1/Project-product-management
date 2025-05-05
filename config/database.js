const mongoose = require("mongoose"); // nhúng mongoose

module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL); // kết nối với db
    console.log("Connect Success!");
  } catch (error) {
    console.log("Connect Error!");
  }
}
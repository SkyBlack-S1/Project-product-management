const multer  = require('multer');
module.exports = () => {
  const storage = multer.diskStorage({ // multer đã lưu ngầm biến "file" nên không cần truyền vào
    destination: function (req, file, cb) {
      cb(null, "./public/uploads/"); // dest -> Từ thư mục gốc, đi vào public/uploads
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, `${uniqueSuffix}-${file.originalname}`); // định dạng tên file
    },
  });

  return storage;
};

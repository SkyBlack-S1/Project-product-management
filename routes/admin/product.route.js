const express = require("express");
const router = express.Router();
const multer  = require('multer'); // hỗ trợ upload ảnh
const storageMulter = require("../../helpers/storageMulter");
const upload = multer({ storage: storageMulter() }); 


const controller = require("../../controllers/admin/product.controller");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus); // Phải trùng cả Route lẫn Method mới truy cập được vào Controller

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.create);

router.post("/create", upload.single("thumbnail"), controller.createPost);

module.exports = router;
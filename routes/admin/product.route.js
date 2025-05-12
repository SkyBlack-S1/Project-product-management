const express = require("express");
const router = express.Router();
const multer  = require('multer'); // hỗ trợ upload ảnh
const storageMulter = require("../../helpers/storageMulter");
const upload = multer({ storage: storageMulter() }); 


const controller = require("../../controllers/admin/product.controller");
const validate = require("../../validates/admin/product.validate");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus); // Phải trùng cả Route lẫn Method mới truy cập được vào Controller

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.create); // lấy ra giao diện

router.post(
  "/create", 
  upload.single("thumbnail"), 
  validate.createPost,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id", 
  upload.single("thumbnail"),
  validate.createPost,
  controller.editPatch
);

router.get("/detail/:id", controller.detail);

module.exports = router;
const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/product.controller");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus); // Phải trùng cả Route lẫn Method mới truy cập được vào Controller

module.exports = router;
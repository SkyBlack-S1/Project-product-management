const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/product.controller");

router.get("/", controller.index);

router.get("/:slug", controller.detail); // slug (có unique) đã là duy nhất nên không cần thêm id

module.exports = router;
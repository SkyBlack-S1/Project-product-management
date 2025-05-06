const express = require("express"); //dashboard tương tự trang home bên client
const router = express.Router();

const controller = require("../../controllers/admin/dashboard.controller");

router.get("/", controller.dashboard);

module.exports = router;
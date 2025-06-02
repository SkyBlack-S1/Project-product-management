const express = require('express');
require('dotenv').config(); // nhúng dotenv
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const indexRoute = require("./routes/client/index.route");
const adminRoute = require("./routes/admin/index.route");
const systemConfig = require("./config/system");
const flash = require('express-flash');
const moment = require('moment');
const cookieParser = require('cookie-parser');
const session = require('express-session');


const database = require("./config/database");
database.connect();

const app = express();
const port = process.env.PORT;

// Ghi đè phương thức gửi lên thành PATCH, DELETE
app.use(methodOverride('_method'));

// parse application/x-www-form-urlencoded -> Để lấy req.body
app.use(bodyParser.urlencoded({ extended: false }));

// Template Engines (PUG)
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// Flash -> Hỗ trợ hiển thị thông báo
app.use(cookieParser("HUYENCUTEPHOMAIQUE"));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// TinyMCE
app.use(
  '/tinymce', 
  express.static(path.join(__dirname, 'node_modules', 'tinymce'))
);

// App Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin; // Biến toàn cục chỉ tồn tại trong tất cả file .pug
app.locals.moment = moment;

// Trong file Public -> Người dùng có thể truy cập
app.use(express.static(`${__dirname}/public`)); // Trong file pug chỉ cần "/" là sẽ đi vào folder "public/"

// Routes
indexRoute(app); // Route chính phía client
adminRoute(app); // Route chính phía admin

// Trang 404
app.get(/.*/, (req, res) => {
  res.render("client/pages/errors/404", {
    pageTitle: "404 Not Found",
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
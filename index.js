const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const indexRoute = require("./routes/client/index.route");
const adminRoute = require("./routes/admin/index.route");
const systemConfig = require("./config/system");
require('dotenv').config(); // nhúng dotenv


const database = require("./config/database");
database.connect();

const app = express();
const port = process.env.PORT;

app.use(methodOverride('_method'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.set("views", "./views");
app.set("view engine", "pug");

// App Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin; // Biến toàn cục, tồn tại trong tất cả file .pug

app.use(express.static("public"));

// Routes
indexRoute(app);
adminRoute(app);
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

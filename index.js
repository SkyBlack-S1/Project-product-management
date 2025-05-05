const express = require('express');
const indexRoute = require("./routes/client/index.route");
require('dotenv').config(); // nhúng dotenv

const database = require("./config/database");
database.connect();

const app = express();
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

indexRoute(app); // Routes

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

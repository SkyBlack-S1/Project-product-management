const express = require('express');
const indexRoute = require("./routes/client/index.route");
require('dotenv').config(); // nhúng dotenv

const app = express();
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

indexRoute(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

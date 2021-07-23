const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");

const app = express();

app.use(
  cors({
    origin: process.env.frontEndLink,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(routes);

app.use((err, _req, res, _next) => {
  if (err) {
    res.send(err.message);
  }
});

app.listen(process.env.PORT || 9999, () => {
  console.log(`Server started at http://localhost:${process.env.PORT}`);
});

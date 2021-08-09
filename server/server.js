const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("../routes");
const path = require("path");

exports.start = () => {
  const app = express();

  app.use(
    cors({
      origin: process.env.frontEndLink,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(cookieParser());

  // app.use(
  //   express.static(path.join(__dirname, "..", "..", "project-client", "build"))
  // );

  app.use(routes);

  app.use((err, _req, res, next) => {
    if (err) {
      if (!res.statusCode || !(res.statusCode > 399)) {
        res.status(500);
      }
      return res.json({ error: err.message });
    }
    next();
  });

  // app.use("*", (_req, res) => {
  //   res.sendFile(
  //     path.join(__dirname, "..", "..", "project-client", "build", "index.html")
  //   );
  // });

  app.listen(process.env.PORT || process.env.port || 9999, () => {
    console.log(`Server started at http://localhost:${process.env.PORT}`);
  });
};

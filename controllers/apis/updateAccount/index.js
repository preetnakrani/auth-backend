const router = require("express").Router();
const password = require("./passwordUpdate");
const email = require("./emailUpdate");
const username = require("./usernameUpdate");

router.use("/password", password);

router.use("/email", email);

router.use("/username", username);

module.exports = router;

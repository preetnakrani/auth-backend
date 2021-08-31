const router = require("express").Router();
const password = require("./passwordUpdate");

router.use("/password", password);

module.exports = router;

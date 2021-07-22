const router = require("express").Router();

const api = require("./apis");

router.use("/apis", api);

module.exports = router;

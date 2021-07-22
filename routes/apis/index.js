const router = require("express").Router();

let version = `${process.env.APIVersion}`;
const apiVersion = require(`./${version}`);
router.use(`/${version}`, apiVersion);

module.exports = router;

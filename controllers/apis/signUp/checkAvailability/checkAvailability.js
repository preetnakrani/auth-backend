const router = require("express").Router();
const userServices = require("../../../../services/user");

router.use("/username", async (req, res) => {
  if (req.body.username) {
    let user = await userServices.getUser({
      username: req.body.username,
    });
    return res.json({ available: !user });
  }
  return res.json({ available: false });
});

module.exports = router;

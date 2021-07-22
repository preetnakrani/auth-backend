const router = require("express").Router();
const auth = require("../../../utils/auth").authMiddleWare;
const userServices = require("../../../services/user");

router.post("/", auth, async (req, res) => {
  await userServices.incrementUser({ token_num: 1 }, { user_id: req.user_id });
  res.clearCookie(process.env.cookieName);
  return res.send("You have successfully logged out!");
});

module.exports = router;

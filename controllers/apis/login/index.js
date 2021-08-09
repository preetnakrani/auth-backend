const router = require("express").Router();
const userTokens = require("../../../utils/auth");
const bcrypt = require("bcrypt");
const userServices = require("../../../services/user");

router.post("/", async (req, res, next) => {
  let username = req.body.username,
    password = req.body.password;
  let user = await userServices.getUser({
    username: username,
    is_verified: true,
  });
  if (!user) {
    res.status(404);
    return next(new Error("User not found!"));
  }
  let valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401);
    return next(new Error("Invalid Username or Password"));
  }

  let [accessToken, refreshToken] = await userTokens.createTokens({
    user_id: user.user_id,
    username: user.username,
    email: user.email,
    token_num: user.token_num,
  });

  res.setHeader("Access-Control-Expose-Headers", "Set-Cookie");
  return res
    .cookie(process.env.cookieName, refreshToken, {
      httpOnly: true,
      secure: true,
    })
    .json({ accessToken, message: "Login Successful!" });
});

module.exports = router;

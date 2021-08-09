const router = require("express").Router();
const jwt = require("jsonwebtoken");
const userTokens = require("../../../utils/auth");
const User = require("../../../db/models/User");

const login = require("../../../controllers/apis/login");
const logout = require("../../../controllers/apis/logout");
const signup = require("../../../controllers/apis/signUp");
const update = require("../../../controllers/apis/updateAccount");

const auth = require("../../../utils/auth/index").authMiddleWare;

router.use("/test-delay", (req, res, next) => {
  setTimeout(() => {
    return res.send("Server is up!");
  }, 3000);
});

router.use("/test-error", (req, res, next) => {
  next(new Error("heelo is it me your are looking for"));
});

router.use("/unprotected", (_req, res) => {
  res.send("This is non protected test!");
});

router.use("/protected", auth, (_req, res) => {
  res.send("This is the protected test!");
});

router.get("/refresh", async (req, res) => {
  let token = req.cookies[process.env.cookieName];
  if (!token) {
    return res.json({ ok: false, accessToken: "" });
  }
  let cookie = null;
  try {
    cookie = jwt.verify(token, process.env.REFRESH_TOKEN);
  } catch (e) {
    console.log(e);
    return res.json({ ok: false, accessToken: "" });
  }
  let user = await User.findOne({
    where: { user_id: cookie.user_id, is_verified: true },
  });

  if (!user) {
    return res.json({ ok: false, accessToken: "" });
  }

  if (user.token_num != cookie.token_num) {
    return res.json({ ok: false, accessToken: "" });
  }

  res.cookie(
    process.env.cookieName,
    userTokens.createRefreshToken({
      username: user.username,
      user_id: user.user_id,
      email: user.email,
      token_num: user.token_num,
    }),
    {
      httpOnly: true,
      sameSite: "none",
    }
  );

  return res.json({
    ok: true,
    accessToken: userTokens.createAccessToken({
      username: user.username,
      user_id: user.user_id,
      email: user.email,
      token_num: user.token_num,
    }),
  });
});

router.use("/login", login);
router.use("/logout", logout);
router.use("/signup", signup);
router.use("/update", update);

module.exports = router;

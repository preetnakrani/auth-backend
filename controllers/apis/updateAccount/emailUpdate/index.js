const router = require("express").Router();
const auth = require("../../../../utils/auth").authMiddleWare;
const jwt = require("jsonwebtoken");
const userServices = require("../../../../services/user");

router.post("/", auth, async (req, res, next) => {
  let user = await userServices.getUser({
    user_id: req.user_id,
    is_verified: true,
  });
  if (!user) {
    res.status(404);
    next(new Error("No verified user found!"));
  }

  let newEmail = req.body.email;
  let token = jwt.sign(
    { user_id: user.user_id, username: user.username, email: newEmail },
    process.env.EMAIL_TOKEN + user.password,
    { expiresIn: process.env.EMAIL_TOKEN_EXPIRY }
  );
  res.send("Email sent");
  let link = `${process.env.backEndLink}/apis/${process.env.APIVersion}/update/email/verify/${user.user_id}/${token}`;

  try {
    await sendEmail(
      path.join(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "assets",
        "email-templates",
        "reset-email"
      ),
      { link, username },
      newEmail
    );
  } catch (err) {
    return next(err);
  }
});

router.use("verify/:id/:token", async (req, res, next) => {
  let user = await userServices.getUser({
    user_id: req.params.id,
    is_verified: true,
  });
  if (!user) {
    res.status(404);
    return next(new Error("Invalid Link"));
  }
  let token = null;
  try {
    token = jwt.verify(
      req.params.token,
      process.env.EMAIL_TOKEN + user.password
    );
  } catch (e) {
    res.status(401);
    return next(new Error("Invalid link!"));
  }
  await userServices.updateUser({ email: token.email || user.email }, user);
  return res.send("Email has been update!");
});

module.exports = router;

const router = require("express").Router();
const jwt = require("jsonwebtoken");
const path = require("path");
const userServices = require("../../../services/user");
const sendEmail = require("../../../utils/emailService");

router.post("/", async (req, res, next) => {
  let username = req.body.username;
  let user = await userServices.getUser({
    username: username,
    is_verified: false,
  });
  if (!user) {
    res.status(404);
    return next(new Error("User is not registered or already verified!"));
  }
  console.log(
    "hreerehadklfhalskdfjas;ldfja;sldjf;alsjf;lasdkjf;lasdjkf;lasdjf;la"
  );
  await userServices.incrementUser({ token_num: 1 }, user);
  res.send("Email resent!");
  username = user.username;
  let token = jwt.sign(
    {
      username: user.username,
      email: user.email,
      user_id: user.user_id,
      token_num: user.token_num,
    },
    process.env.EMAIL_TOKEN,
    {
      expiresIn: process.env.EMAIL_TOKEN_EXPIRY,
    }
  );

  let link = `${process.env.backEndLink}/apis/${process.env.APIVersion}/signup/confirmation/${token}`;

  try {
    await sendEmail(
      path.join(
        __dirname,
        "..",
        "..",
        "..",
        "assets",
        "email-templates",
        "signUp"
      ),
      { link, username },
      user.email
    );
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

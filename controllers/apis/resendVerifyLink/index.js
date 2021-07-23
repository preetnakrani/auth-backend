const router = require("express").Router();
const jwt = require("jsonwebtoken");
const path = require("path");
const userServices = require("../../../services/user");
const sendEmail = require("../../../utils/emailService");

router.post("/resend", async (req, res, next) => {
  let username = req.body.username;
  let user = await userServices.getUser({
    username: username,
    is_verified: false,
  });
  if (!user) {
    res.status(404);
    return next(new Error("User is not registered or already verified!"));
  }
  await userServices.increment({ token_num: 1 });
  res.send("Email resent!");
  username = user.username;
  let token = jwt.sign(
    {
      username: user.dataValues.username,
      email,
      user_id: user.dataValues.user_id,
      ver: user.dataValues.token_num,
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

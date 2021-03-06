const router = require("express").Router();
const jwt = require("jsonwebtoken");
const userServices = require("../../../../services/user");
const bcrypt = require("bcrypt");
const path = require("path");
const sendEmail = require("../../../../utils/emailService/index");

router.post("/", async (req, res, next) => {
  let username = req.body.username;
  let user = await userServices.getUser({
    username: username,
    is_verified: true,
  });
  if (!user) {
    res.status(404);
    return next(new Error("No verified user found!"));
  }

  let token = jwt.sign(
    { user_id: user.user_id, email: user.email, username: user.username },
    process.env.EMAIL_TOKEN + user.password,
    { expiresIn: process.env.EMAIL_TOKEN_EXPIRY }
  );
  res.send("Email sent");
  let link = `${process.env.backEndLink}/apis/${process.env.APIVersion}/update/password/verify/${user.user_id}/${token}`;

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
        "reset-password"
      ),
      { link, username },
      user.email
    );
  } catch (err) {
    console.log(err.message);
    return next(err);
  }
});

router.post("/:id/:token", async (req, res, next) => {
  let user = await userServices.getUser({
    user_id: req.params.id,
    is_verified: true,
  });
  if (!user) {
    res.status(404);
    return next(new Error("Invalid Link"));
  }
  let token = null;
  console.log("here");
  console.log(req.body);
  try {
    token = jwt.verify(
      req.params.token,
      process.env.EMAIL_TOKEN + user.password
    );
  } catch (e) {
    res.status(401);
    return next(new Error("Invalid link!"));
  }
  if (req.body.confirmpassword != req.body.password) {
    res.status(401);
    return next(new Error("Passwords don't match!"));
  }
  let password = await bcrypt.hash(req.body.password || " ", 10);
  await userServices.updateUser(
    { password: password, token_num: user.token_num + 1 },
    user
  );

  return res.send("Password has been reset!");
});

router.use("/verify/:id/:token", async (req, res, next) => {
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
  return res.redirect(
    `${process.env.frontEndLink}/update/password/${req.params.id}/${req.params.token}`
  );
});

module.exports = router;

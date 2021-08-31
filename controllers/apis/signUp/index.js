const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const userServices = require("../../../services/user");
const sendEmail = require("../../../utils/emailService");

const confirmation = require("./confirmation");
const availability = require("./checkAvailability/checkAvailability");

router.post("/", async (req, res, next) => {
  let data = req.body;
  let username = data.username;
  let email = data.email;
  if (!username || !data.password || !email) {
    res.status(500);
    return next(new Error("Please input all data to signup"));
  }
  let password = await bcrypt.hash(data.password || " ", 10);
  let user = null;
  try {
    user = await userServices.createUser({ username, email, password });
    await userServices.incrementUser({ token_num: 1 }, user);
  } catch (e) {
    console.log(e);
    res.status(500);
    return next(
      new Error(
        `${email} has already been resigisterd, if you think this is an error you can claim this email by contacting support!`
      )
    );
  }
  res.send("Sign Up Successful");

  let token = jwt.sign(
    {
      username,
      email,
      user_id: user.dataValues.user_id,
      token_num: user.dataValues.token_num,
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
      email
    );
  } catch (err) {
    console.log(err.message);
    return next(err);
  }
});

router.use("/confirmation", confirmation);
router.use("/availability", availability);

module.exports = router;

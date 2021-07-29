const router = require("express").Router();
const jwt = require("jsonwebtoken");
const userServices = require("../../../../services/user");

router.use("/:token", async (req, res, next) => {
  let user;
  try {
    user = jwt.verify(req.params.token, process.env.EMAIL_TOKEN);
  } catch (e) {
    console.log(e);
    res.status(401);
    return next(new Error("Link Invalid"));
  }
  let usr = await userServices.getUser({
    user_id: user.user_id,
    is_verified: false,
    token_num: user.token_num,
  });
  if (!usr) {
    res.status(401);
    return next(new Error("Link Expired"));
  }
  await userServices.updateUser(
    { is_verified: true },
    { user_id: user.user_id }
  );
  await userServices.incrementUser({ token_num: 1 }, usr);
  return res.redirect(`${process.env.frontEndLink}/login`); // redirect to login page
});

module.exports = router;

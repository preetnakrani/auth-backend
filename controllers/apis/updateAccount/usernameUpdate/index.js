const router = require("express").Router();
const auth = require("../../../../utils/auth").authMiddleWare;
const jwt = require("jsonwebtoken");
const userServices = require("../../../../services/user");

router.post("/", auth, async (req, res, next) => {
  try {
    await userServices.updateUser(
      {
        email: req.body.email,
      },
      { user_id: req.user_id, is_verified: true }
    );
    await userServices.incrementUser(
      { token_num: 1 },
      { user_id: req.user_id }
    );
    if (!user) {
      res.status(404);
      next(new Error("No verified user found!"));
    }
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

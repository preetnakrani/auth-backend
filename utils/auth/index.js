const jwt = require("jsonwebtoken");

const createTokens = (data) => {
  return [createAccessToken(data), createRefreshToken(data)];
};

const createAccessToken = (data) => {
  const createToken = jwt.sign(data, process.env.ACCESS_TOKEN, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
  return createToken;
};

const createRefreshToken = (data) => {
  const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
  return refreshToken;
};

const authMiddleWare = (req, res, next) => {
  const authorization = req.headers["authorization"];
  if (!authorization) {
    res.status(401);
    return next(new Error("Login again to continue to use the app!"));
  }
  let valid = null;
  try {
    let token = authorization.split(" ")[1];
    valid = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.user_id = valid.user_id;
    return next();
  } catch (e) {
    res.status(401);
    return next(new Error("Login again to continue to use the app!"));
  }
};

module.exports = {
  createRefreshToken,
  createTokens,
  createAccessToken,
  authMiddleWare,
};

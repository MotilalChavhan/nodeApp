const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.params.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

const IsUser = async (req, res, next) => {
    if (req.user.user_type_id === 0) {
        return next();
    }
    return res.status(401).send("Unauthorized!");
}
const IsAdmin = async (req, res, next) => {
    if (req.user.user_type_id === 1) {
        return next();
    }
    return res.status(401).send("Unauthorized!");
}

module.exports = { verifyToken, IsUser, IsAdmin };
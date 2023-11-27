const jwt = require("jsonwebtoken");

const checkLogin = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).send("Unauthorized request");
    }
    let token = req.headers.authorization.split(" ")[1];
    if (token === "null") {
      return res.status(401).send("Unauthorized request");
    }
    let payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!payload && !payload.id) {
      return res.status(401).send("Unauthorized request");
    }
    const { id } = payload;
    req.userId = id;
    next();
  } catch (error) {
    res.status(403).json({ error: "Authentication failure", err: error });
    next("Authentication failure");
  }
};

module.exports = checkLogin;

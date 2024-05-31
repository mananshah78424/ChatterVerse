const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.json");

module.exports = (context) => {
  if (context.req && context.req.headers.authorization) {
    console.log(context.req.headers.authorization);
    const token = context.req.headers.authorization.split("Bearer ")[1];
    console.log(token);
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      console.log("User logged in - Middleware");
      context.user = decodedToken;
    });
  }
  return context;
};

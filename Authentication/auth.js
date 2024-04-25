const { expressjwt: jwt } = require("express-jwt");

function authJwt() {
  const secret = process.env.secret;
  return jwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  });
}
async function isRevoked(req, payload, done) {
  req.user = payload.payload;
  console.log(payload.payload);
}

module.exports = authJwt;

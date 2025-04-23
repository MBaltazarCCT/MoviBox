const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const dotenv = require("dotenv");
dotenv.config();

const TENANT_ID = process.env.TENANT_ID;
const CLIENT_ID = process.env.CLIENT_ID;

const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${TENANT_ID}/discovery/v2.0/keys`,
});

const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
};

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);
  console.log("🔑 Token received:", token);

  jwt.verify(
    token,
    getKey,
    {
      audience: `api://${CLIENT_ID}`,
      issuer: `https://sts.windows.net/${TENANT_ID}/`,
    },
    (err, decoded) => {
      if (err) {
        console.error("❌ Token verification failed:", err);
        console.error("decoder", decoded);
        return res.sendStatus(403);
      }

      console.log("✅ Decoded Token:", decoded);

      req.user = decoded;
      next();
    }
  );
}




module.exports = authenticateToken;
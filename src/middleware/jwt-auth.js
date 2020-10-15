const { JsonWebTokenError } = require("jsonwebtoken");
const AuthService = require('../auth/auth-service');

const requireAuth = (req, res, next) => {
  const authToken = req.get('Authorization') || '';
  let bearerToken;
  if (!authToken.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({error: 'Missing bearer token'});
  } else {
    bearerToken = authToken.slice(7, authToken.length);
  }

  try {
    const payload = AuthService.verifyJwt(bearerToken);
    AuthService.getUserWithUsername(req.app.get('db'), payload.sub)
      .then(user => {
        if (!user) {
          return res.status(401).json({error: 'Unauthorized request - user'});
        }
        req.user = user;
        next();
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        return res.status(401).json({ error: "Unauthorized request - other" });
      }
      next(error);
    }
};

module.exports = {requireAuth};

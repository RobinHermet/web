const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const athleteId = decodedToken.athleteId;
    const isAdmin = decodedToken.isAdmin
    req.auth = {athleteId : athleteId, isAdmin: isAdmin};
    if (req.body.athleteId && req.body.athleteId !== athleteId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};

//faudra applique ce middleware à toutes les routes qui seront à protéger
//mais d'abord faudrait trouver comment renvoyer le token à chaque requête faite par
//un client à notre API 
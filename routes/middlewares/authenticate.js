const isset = require("../../helpers/isset");
const jwt = require("jsonwebtoken");
const query = require("../../database/query");

function authenticate(req, res, next) {
    let authorizationHeader = req.headers["authorization"];
    if (!isset(authorizationHeader)) return res.sendStatus(401);
    const token = authorizationHeader.split(' ')[1];
    if (!isset(token)) return res.sendStatus(401);
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
        const auth = await query("Select * from users where email = ?", [user?.email]);
        if (err || auth.length === 0) return res.sendStatus(403)
        req.user = user;
        next()
    })
}

module.exports = authenticate;

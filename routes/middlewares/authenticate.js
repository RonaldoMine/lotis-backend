const jwt = require("jsonwebtoken");
const isset = require("../../helpers/isset");
const User = require("../../models/user")

function authenticate(req, res, next) {
    let authorizationHeader = req.headers["authorization"];
    if (!isset(authorizationHeader)) return res.sendStatus(401);
    const token = authorizationHeader.split(' ')[1];
    if (!isset(token)) return res.sendStatus(401);
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
        if (err || user === undefined) return res.sendStatus(403)
        const auth = await User.findOne({where: {email: user?.email}});
        if (!user) return res.sendStatus(403)
        req.user = auth;
        next()
    })
}

module.exports = authenticate;

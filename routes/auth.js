const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const isset = require("../helpers/isset");
const query = require("../database/query");
const router = express.Router();

router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    if (isset(email) && isset(password)) {
        const result = await query('Select * from users where email = ?', [email]);
        if (result.length > 0) {
            const user = result[0];
            if (bcrypt.compareSync(password, user.password)) {
                const token = jwt.sign({email: email, id: user.id}, process.env.TOKEN_SECRET, {expiresIn: '10h'});
                return res.status(200).json({
                    user: {
                        ...user,
                        token: token
                    }
                })
            }
        }
    }
    return res.status(400).send();
})


module.exports = router;

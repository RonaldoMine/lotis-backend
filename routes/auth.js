const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const isset = require("../helpers/isset");
const query = require("../database/query");
const router = express.Router();

router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    console.log(req.body)
    if (isset(email) && isset(password)) {
        const result = await query('Select * from users where email = ?', [email]);
        if (result.length > 0) {
            const user = result[0];
            if (bcrypt.compareSync(password, user.password)) {
                const token = jwt.sign({email: email, id: user.id}, process.env.TOKEN_SECRET, {expiresIn: '48h'});
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


router.post("/signup", async (req, res) => {
    const {firstName, lastName, phone, email, commercialRegisterNumber, cniNumber, password} = req.body
    if (isset(firstName) && isset(lastName) && isset(phone) && isset(email) && isset(commercialRegisterNumber) && isset(cniNumber) && isset(password)) {
        const user = await query("Select * from users where email = ?", [email]);
        if (user.length === 0) {
            const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
            const result = await query('Insert into users(first_name, last_name, phone, email, commercial_register_number, cni_number, password) values(?,?,?,?,?,?,?)', [firstName, lastName, phone, email, commercialRegisterNumber, cniNumber, hashPassword])
            if (result) {
                const user = await query("Select * from users where id = ?", [result.insertId]);
                const token = jwt.sign({email: email, id: result.insertId}, process.env.TOKEN_SECRET, {expiresIn: '48h'});
                return res.status(200).json({
                    user: {
                        ...user[0],
                        token: token
                    }
                })
            } else {
                return res.sendStatus(500)
            }
        }
    }
    return res.status(400).send();
})


module.exports = router;

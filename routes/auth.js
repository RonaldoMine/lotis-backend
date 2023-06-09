const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const isset = require("../helpers/isset");
const User = require("../models/user");
const router = express.Router();

router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    if (isset(email) && isset(password)) {
        const user = await User.findOne({
            where: {
                email: email
            }
        });
        if (user) {
            if (bcrypt.compareSync(password, user.password)) {
                const token = jwt.sign({email: email, id: user.id}, process.env.TOKEN_SECRET, {expiresIn: '48h'});
                return res.status(200).json({
                    user: {
                        ...user.dataValues,
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
        const user = await User.findOne({where: {email: email}});
        if (!user) {
            const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
            const user = await User.create({
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                email: email,
                commercial_register_number: commercialRegisterNumber,
                cni_number: cniNumber,
                password: hashPassword
            })
            const token = jwt.sign({
                email: email,
                id: user.insertId
            }, process.env.TOKEN_SECRET, {expiresIn: '48h'});
            return res.status(200).json({
                user: {
                    ...user.dataValues,
                    token: token
                }
            })
        }
    }
    return res.status(400).send();
})


module.exports = router;

const express = require("express")
const route = express.Router();
const query = require("../database/query")
const isset = require("../helpers/isset");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const authenticate = require("./middlewares/authenticate");

route.get('/', authenticate, async (req, res) => {
    const users = await query("Select * from users");
    res.send(users)
})

route.post("/store", async (req, res) => {
    const {firstName, lastName, phone, email, commercialRegisterNumber, cniNumber, password} = req.body
    if (isset(firstName) && isset(lastName) && isset(phone) && isset(email) && isset(commercialRegisterNumber) && isset(cniNumber) && isset(password)) {
        const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        const user = await User.create({
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            email: email,
            commercial_register_number: commercialRegisterNumber,
            cni_number: cniNumber,
            password: hashPassword
        });
        if (user) {
            return res.sendStatus(200)
        } else {
            return res.sendStatus(500)
        }
    }
    return res.sendStatus(400)
})


route.put("/update/:id", async (req, res) => {
    const ID = parseInt(req.params.id)
    const {firstName, lastName, phone, email, commercialRegisterNumber, cniNumber} = req.body
    if (firstName !== "" && lastName !== "" && phone !== "" && email !== "" && commercialRegisterNumber !== "" && cniNumber !== "") {
        const user = await User.findByPk(ID);
        if (user) {
            user.first_name = firstName;
            user.last_name = lastName;
            user.phone = phone;
            user.email = email;
            user.commercial_register_number = commercialRegisterNumber;
            user.cni_number = cniNumber;
            user.first_name = firstName;
            await user.save();
            return res.sendStatus(200)
        }
    }
    return res.sendStatus(400)
})

route.delete("/delete/:id", async (req, res) => {
    const ID = parseInt(req.params.id)
    const user = await User.findByPk(ID);
    if (user) {
        await user.destroy();
        return res.sendStatus(200)
    }
    return res.sendStatus(400)
})

module.exports = route;

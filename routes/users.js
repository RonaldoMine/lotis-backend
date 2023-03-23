const express = require("express")
const route = express.Router();
const query = require("../database/query")
const isset = require("../helpers/isset");
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
        const result = await query('Insert into users(first_name, last_name, phone, email, commercial_register_number, cni_number, password) values(?,?,?,?,?,?,?)', [firstName, lastName, phone, email, commercialRegisterNumber, cniNumber, hashPassword])
        if (result) {
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
        const user = await query("Select * from users where id = ?", [ID]);
        if (user.length > 0) {
            await query("Update users set first_name=?, last_name=?, phone=?,email=?,commercial_register_number=?, cni_number=? where id = ?",
                [firstName, lastName, phone, email, commercialRegisterNumber, cniNumber, ID])
            return res.sendStatus(200)
        }
    }
    return res.sendStatus(400)
})

route.delete("/delete/:id", async (req, res) => {
    const ID = parseInt(req.params.id)
    const user = await query("Select * from users where `id` = ?", [ID]);
    if (user.length > 0) {
        await query("Delete from users where id = ?", [ID])
        return res.sendStatus(200)
    }
    return res.sendStatus(400)
})

module.exports = route;

const express = require("express")
const route = express.Router();
const query = require("../database/query");
const isset = require("../helpers/isset");
const Role = require("../models/role")
const {where} = require("sequelize");

route.get('/', async (req, res) => {
    const roles = await Role.findAll();
    res.send(roles)
})

route.post("/store", async (req, res) => {
    const {name} = req.body
    if (isset(name)) {
        const role = await Role.findOne({where: {name: name}})
        if (!role){
            await Role.create({name: name})
            return res.send(role)
        }
    }
    return res.status(400).send()
})


route.put("/update/:id", async (req, res) => {
    const ID = parseInt(req.params.id)
    const {name} = req.body
    if (isset(name)) {
        const role = await Role.findByPk(ID)
        if (role) {
            const existRole = await Role.findOne({where: {name: name}})
            if (!existRole || existRole.id === role.id){
                role.name = name;
                await role.save()
                return res.status(200).send()
            }
        }
    }
    return res.status(400).send()
})

route.delete("/delete/:id", async (req, res) => {
    const ID = parseInt(req.params.id)
    const role = await Role.findByPk(ID)
    if (role) {
        await role.destroy()
        return res.status(200).send()
    }
    return res.status(400).send()
})


module.exports = route;

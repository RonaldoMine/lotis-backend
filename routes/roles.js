const express = require("express")
const route = express.Router();
const query = require("../database/query");
const isset = require("../helpers/isset");

route.get('/', async (req, res) => {
    const roles = await query("Select * from roles");
    res.send(roles)
})

route.post("/store", async (req, res) => {
    const {name} = req.body
    if (isset(name)) {
        const result = await query('Insert into roles(name) values(?)', [name])
        if (result) {
            return res.status(200).send()
        } else {
            return res.status(500).send()
        }
    }
    return res.status(400).send()
})


route.put("/update/:id", async (req, res) => {
    const ID = parseInt(req.params.id)
    const {name} = req.body
    if (isset(name)) {
        const role = await query("Select * from roles where id = ?", [ID]);
        if (role.length > 0) {
            await query("Update roles set name=? where id = ?", [name, ID])
            return res.status(200).send()
        }
    }
    return res.status(400).send()
})

route.delete("/delete/:id", async (req, res) => {
    const ID = parseInt(req.params.id)
    const role = await query("Select * from roles where id = ?", [ID]);
    if (role.length > 0) {
        await query("Delete from roles where id = ?", [ID])
        return res.status(200).send()
    }
    return res.status(400).send()
})


module.exports = route;

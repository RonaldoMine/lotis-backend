const express = require("express")
const route = express.Router();
const query = require("../database/query")
const isset = require("../helpers/isset");

route.get('/', async (req, res) => {
    let {user} = req.query;
    let lands;
    if (isset(user)) {
        lands = await query("Select * from lands where user_id=?", [user]);
    } else {
        lands = await query("Select * from lands");
    }
    res.send(lands)
})

route.post("/store", async (req, res) => {
    const {town, district, localisation, dimension, referenceNumber, surface, mapCoordinates, userId} = req.body
    if (isset(town) && isset(district) && isset(localisation) && isset(dimension) && isset(referenceNumber) && isset(surface) && isset(mapCoordinates) && isset(userId)) {
        const user = await query("Select * from users where id = ?", [userId]);
        if (user.length > 0) {
            try {
                await query('Insert into lands(town, district, localisation, dimension, reference_number, surface, map_coordinates, user_id) values(?,?,?,?,?,?,?,?)', [town, district, localisation, dimension, referenceNumber, surface, mapCoordinates, userId])
                return res.status(200).send()
            } catch (e) {
                return res.status(400).json(e)
            }
        }
    }
    return res.status(400).send()
})


route.put("/update/:id", async (req, res) => {
    const ID = parseInt(req.params.id)
    const {town, district, localisation, dimension, referenceNumber, surface, mapCoordinates} = req.body
    if (isset(town) && isset(district) && isset(localisation) && isset(dimension) && isset(referenceNumber) && isset(surface) && isset(mapCoordinates)) {
        const land = await query("Select * from lands where id = ?", [ID]);
        if (land.length > 0) {
            try {
                await query("Update lands set town=?, district=?, localisation=?,dimension=?,reference_number=?, surface=?, map_coordinates=? where id = ?",
                    [town, district, localisation, dimension, referenceNumber, surface, mapCoordinates, ID])
                return res.status(200).send()
            } catch (e) {
                console.log(e)
            }
        }
    }
    return res.status(400).send()
})

route.delete("/delete/:id", async (req, res) => {
    const ID = parseInt(req.params.id)
    const land = await query("Select * from lands where id = ?", [ID]);
    if (land.length > 0) {
        await query("Delete from lands where id = ?", [ID])
        return res.status(200).send()
    }
    return res.status(400).send()
})

module.exports = route;

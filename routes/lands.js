const express = require("express")
const query = require("../database/query")
const isset = require("../helpers/isset");
const {upload, storeFile} = require("../helpers/storage");
const route = express.Router();

const storeLandFile = (folder, files, landId, userId, type) => {
    if (isset(files)) {
        files.map(async (file) => {
            const pathFile = `${folder}/${file.filename}`;
            storeFile(file, pathFile);
            await query('Insert into files(user_id, land_id, name, path, type) values(?,?,?,?,?)', [userId, landId, file.originalname, pathFile, type])
        })
    }
}

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

route.post("/store", upload.fields([{name: "pictures"}, {name: "documents"}, {name: "plans"}]), async (req, res) => {
    const pictures = req.files['pictures'];
    const documents = req.files['documents'];
    const plans = req.files['plans'];
    const {town, district, localisation, referenceNumber, surface, mapCoordinates} = req.body
    const user = req.user;
    if (isset(town) && isset(district) && isset(localisation) && isset(referenceNumber) && isset(surface) && isset(mapCoordinates)) {
        try {
            const land = await query('Insert into lands(town, district, localisation, reference_number, surface, map_coordinates, user_id) values(?,?,?,?,?,?,?,?)', [town, district, localisation, referenceNumber, surface, mapCoordinates, user.id])
            storeLandFile("pictures", pictures, land.insertId, user.id, "PICTURE")
            storeLandFile("documents", documents, land.insertId, user.id, "DOCUMENT")
            storeLandFile("plans", plans, land.insertId, user.id, "PLAN")
            return res.status(200).send()
        } catch (e) {
            return res.status(400).json(e)
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

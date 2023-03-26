const express = require("express")
const route = express.Router();
const query = require("../database/query");
const isset = require("../helpers/isset");
const File = require("../models/file");
const {upload, storeFile} = require("../helpers/storage");

route.get('/:landId', async (req, res) => {
    const {landId} = req.params;
    const type = req.query.type;
    if (isset(landId) && isset(type)) {
        const files = await File.findAll({where: {land_id: landId, type: type}});
        return res.send(files);
    }
    return res.sendStatus(400);
})

route.post("/store/:landId", upload.array('files'), async (req, res) => {
    const files = req.files
    const {landId} = req.params;
    const {type} = req.body;
    if (isset(files)) {
        const user = req.user;
        files.map(async (file) => {
            await query('Insert into files(user_id, land_id, name, path, type) values(?,?,?,?,?)', [user.id, 1, file.originalname, file.path.replace("\\", "/"), "PICTURE"])
            const pathFile = `pictures/${file.filename}`;
            storeFile(file, pathFile);
            await File.create({user_id: user.id, land_id: landId, name: file.originalname, path: pathFile, type: type})
        })

        return res.sendStatus(200)

    }
    return res.sendStatus(400)
})


route.put("/update/:id", async (req, res) => {
    const ID = parseInt(req.params.id)
    const {name} = req.body
    if (isset(name)) {

    }
    return res.sendStatus(400)
})

route.delete("/delete/:id", async (req, res) => {
    const ID = parseInt(req.params.id)
    const file = await File.findByPk(ID);
    if (file) {
        await file.destroy()
        return res.sendStatus(200)
    }
    return res.sendStatus(400)
})


module.exports = route;

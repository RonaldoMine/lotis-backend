const express = require("express")
const isset = require("../helpers/isset");
const {upload, storeFile} = require("../helpers/storage");
const Land = require("../models/land");
const File = require("../models/file");
const User = require("../models/user");
const route = express.Router();

const storeLandFile = (folder, files, landId, userId, type) => {
    if (isset(files)) {
        files.map(async (file) => {
            const pathFile = `${folder}/${file.filename}`;
            storeFile(file, pathFile);
            await File.create({user_id: userId, land_id: landId, name: file.originalname, path: pathFile, type: type})
        })
    }
}

route.get('/', async (req, res) => {
    let {user} = req.query;
    let lands;
    if (isset(user)) {
        lands = await Land.findAll({where: {user_id: user}});
    } else {
        lands = await Land.findAll({include: User});
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
            const land = await Land.create({
                town: town,
                district: district,
                localisation: localisation,
                reference_number: referenceNumber,
                surface: surface,
                map_coordinates: mapCoordinates,
                user_id: user.id
            });
            storeLandFile("pictures", pictures, land.id, user.id, "PICTURE")
            storeLandFile("documents", documents, land.id, user.id, "DOCUMENT")
            storeLandFile("plans", plans, land.id, user.id, "PLAN")
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
        const land = await Land.findByPk(ID);
        if (land) {
            land.town = town;
            land.district = district;
            land.localisation = localisation;
            land.dimension = dimension;
            land.reference_number = referenceNumber;
            land.surface = surface;
            land.map_coordinates = mapCoordinates;
            await land.save();
            return res.status(200).send()
        }
    }
    return res.status(400).send()
})

route.delete("/delete/:id", async (req, res) => {
    const ID = parseInt(req.params.id)
    const land = await Land.findByPk(ID);
    if (land) {
        await land.destroy();
        return res.status(200).send()
    }
    return res.status(400).send()
})

module.exports = route;

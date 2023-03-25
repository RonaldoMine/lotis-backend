const express = require("express")
const route = express.Router();
const multer = require("multer")
const query = require("../database/query");
const isset = require("../helpers/isset");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/files')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname.replace(" ", "-"))
    }
})
const upload = multer({
    storage: storage,
})

route.get('/:landId', async (req, res) => {
    const {landId} = req.params;
    const type = req.query.type;
    if (isset(landId) && isset(type)) {
        const files = await query("Select * from files where land_id = ? and type = ?", [landId, type]);
        return res.send(files);
    }
    return res.sendStatus(400);
})

route.post("/store", upload.array('files'), async (req, res) => {
    const files = req.files
    if (isset(files)) {
        const user = req.user;
        files.map(async (file) => {
            await query('Insert into files(user_id, land_id, name, path, type) values(?,?,?,?,?)', [user.id, 1, file.originalname, file.path.replace("\\", "/"), "PICTURE"])
        })
        return res.sendStatus(200)

    }
    return res.sendStatus(400)
})


route.put("/update/:id", async (req, res) => {
    const ID = parseInt(req.params.id)
    const {name} = req.body
    if (isset(name)) {
        const role = await query("Select * from roles where id = ?", [ID]);
        if (role.length > 0) {
            await query("Update roles set name=? where id = ?", [name, ID])
            return res.sendStatus(200)
        }
    }
    return res.sendStatus(400)
})

route.delete("/delete/:id", async (req, res) => {
    const ID = parseInt(req.params.id)
    const role = await query("Select * from roles where id = ?", [ID]);
    if (role.length > 0) {
        await query("Delete from roles where id = ?", [ID])
        return res.sendStatus(200)
    }
    return res.sendStatus(400)
})


module.exports = route;

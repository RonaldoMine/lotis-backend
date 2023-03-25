const multer = require("multer");
const os = require("os");
const path = require("path");
const fs = require("fs");
const storage = () => {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, os.tmpdir())
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now();
            cb(null, uniqueSuffix + file.originalname.replace(" ", "-"))
        },
        limits: {
            fieldSize: "10MB"
        }
    })
}

const upload = multer({
    storage: storage(),
})

const storeFile = (file, pathFile) => {
    const saveTo = path.resolve(__dirname, `../public/uploads/${pathFile}`);
    fs.cp(file.path, saveTo, (err) => {});
}
module.exports = {upload, storeFile};


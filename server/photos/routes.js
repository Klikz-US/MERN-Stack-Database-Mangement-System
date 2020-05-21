const Controller = require("./controller");
const Authentication = require("../services/auth");

require("dotenv").config();
const photo_path = process.env.PHOTO_PATH;

const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, photo_path);
    },
    filename: function (req, file, cb) {
        cb(null, req.body.petPhotoName);
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/png"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter,
});

exports.routesConfig = function (app) {
    app.get("/photos/:microchip", [
        Authentication.authMiddleware,
        Controller.getByMicrochip,
    ]);
    app.post("/photos/add", [
        Authentication.authMiddleware,
        upload.single("petPhotoData"),
        Controller.add,
    ]);
};

const multer = require("multer");
const path = require("path");

const storage_product = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, "src/public/assets/image_products");

    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const storage_category = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, "src/public/assets/image_categories");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const storage_avatar = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "src/public/assets/image_avatars");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only .png, .jpg and .jpeg format allowed!"), false);
    }
};

const upload_product = multer({
    storage: storage_product,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 },
}).single("image");

const upload_category = multer({
    storage: storage_category,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 },
}).single("image");

const upload_avatar = multer({
    storage: storage_avatar,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 },
}).single("image");
module.exports = { upload_product, upload_category,upload_avatar };

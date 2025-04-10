const express = require("express");
const { createProduct, getAllProducts, getProductById, deleteProduct, updateProduct } = require("../controllers/ProductController");
const { upload_product } = require("../middleware/upload");
const { checkAdmin, checkUser } = require("../middleware/auth");
const router = express.Router();

router.post("/products", upload_product, checkAdmin, createProduct);
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.put("/products/:id", upload_product, checkAdmin, updateProduct);
router.delete("/products/:id", checkAdmin, deleteProduct);
module.exports = router;

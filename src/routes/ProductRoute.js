const express = require("express");
const { createProduct, getAllProducts, getProductById, deleteProduct, updateProduct } = require("../controllers/ProductController");
const { upload_product } = require("../middleware/upload");

const router = express.Router();

router.post("/products", upload_product, createProduct);
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.put("/products/:id", upload_product, updateProduct);
router.delete("/products/:id", deleteProduct);
module.exports = router;

const express = require("express");
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require("../controllers/CategoryController");
const { upload_category } = require("../middleware/upload");

const router = express.Router();

router.get("/categories", getAllCategories);
router.post("/categories", upload_category, createCategory);
router.get("/categories/:id", getCategoryById); 
router.put("/categories/:id", upload_category, updateCategory); 
router.delete("/categories/:id", deleteCategory); 

module.exports = router;

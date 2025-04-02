const express = require("express");

const { registerUser, loginUser, getUserById, deleteUser, updateUser } = require("../controllers/UserController");
const { upload_avatar } = require("../middleware/upload");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id", getUserById);
router.put("/:id", upload_avatar, updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
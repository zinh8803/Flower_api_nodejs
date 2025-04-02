const db = require("../config/db");
const bcrypt = require('bcrypt');

// Đăng ký người dùng
const registerUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const [existingUser] = await db.execute(
            "SELECT * FROM users WHERE username = ? OR email = ?",
            [username, email]
        );
        if (existingUser.length > 0) {
            return res.status(400).json({
                status: 400,
                message: "Tên người dùng hoặc email đã tồn tại",
                data: null
            });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const [result] = await db.execute(
            "INSERT INTO users (username, password, email) VALUES (?, ?,  ?)",
            [username, hashedPassword, email]);

        const data = {
            user_id: result.insertId,
            username,
            email,
        };

        res.status(201).json({
            status: 201,
            message: "Đăng ký người dùng thành công",
            data
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
            data: null
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const [user] = await db.execute(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );
        if (user.length === 0) {
            return res.status(400).json({
                status: 400,
                message: "Tên người dùng không tồn tại",
                data: null
            });
        }

        const match = await bcrypt.compare(password, user[0].password);
        if (!match) {
            return res.status(400).json({
                status: 400,
                message: "Mật khẩu không đúng",
                data: null
            });
        }

        const data = {
            user_id: user[0].user_id,
            username: user[0].username,
            email: user[0].email,
            avatar: user[0].avatar
        };

        res.status(200).json({
            status: 200,
            message: "Đăng nhập thành công",
            data
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
            data: null
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.execute(
            "SELECT user_id, username, email, avatar FROM users WHERE user_id = ?",
            [id]
        );

        if (result.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "Không tìm thấy người dùng",
                data: null
            });
        }

        res.status(200).json({
            status: 200,
            message: "Lấy thông tin người dùng thành công",
            data: result[0]
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
            data: null
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;
        const avatar = req.file ? `/assets/image_avatars/${req.file.filename}` : null;

        const [check] = await db.execute(
            "SELECT * FROM users WHERE user_id = ?",
            [id]
        );
        if (check.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "Không tìm thấy người dùng để cập nhật",
                data: null
            });
        }

        if (username || email) {
            const [existingUser] = await db.execute(
                "SELECT * FROM users WHERE (username = ? OR email = ?) AND user_id != ?",
                [username || check[0].username, email || check[0].email, id]
            );
            if (existingUser.length > 0) {
                return res.status(400).json({
                    status: 400,
                    message: "Tên người dùng hoặc email đã tồn tại",
                    data: null
                });
            }
        }

        const updateFields = [];
        const values = [];

        if (username) {
            updateFields.push("username = ?");
            values.push(username);
        }
        if (email) {
            updateFields.push("email = ?");
            values.push(email);
        }
        if (password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            updateFields.push("password = ?");
            values.push(hashedPassword);
        }
        if (avatar) {
            updateFields.push("avatar = ?");
            values.push(avatar);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                status: 400,
                message: "Không có dữ liệu để cập nhật",
                data: null
            });
        }

        values.push(id);
        const query = `UPDATE users SET ${updateFields.join(", ")} WHERE user_id = ?`;

        const [result] = await db.execute(query, values);

        res.status(200).json({
            status: 200,
            message: "Cập nhật người dùng thành công",
            data: {
                user_id: id,
                username: username || check[0].username,
                email: email || check[0].email,
                avatar: avatar || check[0].avatar
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
            data: null
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra xem người dùng có tồn tại không
        const [check] = await db.execute(
            "SELECT * FROM users WHERE user_id = ?",
            [id]
        );
        if (check.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "Không tìm thấy người dùng để xóa",
                data: null
            });
        }

        const [result] = await db.execute(
            "DELETE FROM users WHERE user_id = ?",
            [id]
        );

        res.status(200).json({
            status: 200,
            message: "Xóa người dùng thành công",
            data: null
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
            data: null
        });
    }
};

const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            status: 400,
            message: err.message,
            data: null
        });
    } else if (err) {
        return res.status(400).json({
            status: 400,
            message: err.message,
            data: null
        });
    }
    next();
};

module.exports = {
    registerUser,
    loginUser,
    getUserById,
    updateUser,
    deleteUser
};
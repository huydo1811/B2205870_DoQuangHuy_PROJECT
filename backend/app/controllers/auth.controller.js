const MongoDB = require("../utils/mongodb.util");
const DocGiaService = require("../services/docgia.service");
const NhanVienService = require("../services/nhanvien.service");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "khoabimatla18112004";

exports.login = async (req, res, next) => {
    try {
        const { Username, MatKhau } = req.body;
        let user = null;
        let role = "";

        // Tìm trong Độc Giả
        const docGiaService = new DocGiaService(MongoDB.client);
        user = await docGiaService.collection.findOne({ Username });
        if (user) {
            role = "user";
        } else {
            // Tìm trong Nhân Viên
            const nhanVienService = new NhanVienService(MongoDB.client);
            user = await nhanVienService.collection.findOne({ Username });
            if (user) {
                role = "admin";
            }
        }

        if (!user) {
            return res.status(400).json({ message: "Tài khoản không tồn tại!" });
        }

        // So sánh mật khẩu
        const validPassword = await bcrypt.compare(MatKhau, user.MatKhau);
        if (!validPassword) {
            return res.status(400).json({ message: "Mật khẩu không đúng!" });
        }

        // Tạo JWT
        const token = jwt.sign(
            {
                id: user._id,
                Username: user.Username,
                Role: role
            },
            SECRET_KEY,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Đăng nhập thành công!",
            token,
            Role: role,
            info: user
        });
    } catch (error) {
        next(error);
    }
};
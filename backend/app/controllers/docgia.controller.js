const MongoDB = require("../utils/mongodb.util");
const DocGiaService = require("../services/docgia.service");
const NhanVienService = require("../services/nhanvien.service");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT;

exports.create = async (req, res, next) => {
    try {
        const service = new DocGiaService(MongoDB.client);
        const nhanVienService = new NhanVienService(MongoDB.client);

        // Kiểm tra trùng Username ở Độc Giả
        let existedUsername = await service.collection.findOne({ Username: req.body.Username });
        // Kiểm tra trùng Username ở Nhân Viên nếu chưa thấy ở Độc Giả
        if (!existedUsername) {
            existedUsername = await nhanVienService.collection.findOne({ Username: req.body.Username });
        }
        if (existedUsername) {
            return res.status(400).send({ message: "Tên đăng nhập đã tồn tại ở hệ thống!" });
        }

        // Kiểm tra trùng Số điện thoại
        if (req.body.DienThoai) {
            const existedPhone = await service.collection.findOne({ DienThoai: req.body.DienThoai });
            if (existedPhone) {
                return res.status(400).send({ message: "Số điện thoại đã tồn tại!" });
            }
        }

        // Kiểm tra độ dài Username
        if (!req.body.Username || req.body.Username.length < 6) {
            return res.status(400).send({ message: "Username phải có ít nhất 6 ký tự!" });
        }

        // Kiểm tra độ dài Mật khẩu
        if (!req.body.MatKhau || req.body.MatKhau.length < 6) {
            return res.status(400).send({ message: "Mật khẩu phải có ít nhất 6 ký tự!" });
        }

        // Kiểm tra độ dài SDT
        if (!req.body.DienThoai || req.body.DienThoai.length < 10 || req.body.DienThoai.length > 11) {
            return res.status(400).send({ message: "SDT phải có từ 10-11 ký tự!" });
        }

        // Thêm trường Role mặc định là "user"
        req.body.Role = "user";

        // Tạo mã độc giả ngẫu nhiên
        req.body.MaDocGia = "DG" + Math.random().toString().slice(2, 12);

        const result = await service.create(req.body);

        // Tạo JWT
        const token = jwt.sign(
            {
                id: result.insertedId,
                MaDocGia: req.body.MaDocGia,
                Username: req.body.Username,
                Role: req.body.Role
            },
            SECRET_KEY,
            { expiresIn: "7d" }
        );

        res.status(201).send({
            message: "Tạo độc giả thành công!",
            token,
            MaDocGia: req.body.MaDocGia
        });
    } catch (error) {
        next(error);
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const service = new DocGiaService(MongoDB.client);
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 7; // mỗi trang 7 người dùng
        const search = req.query.search || '';

        let filter = {};
        if (search) {
            filter = {
                $or: [
                    // Ghép Ho và Ten để tìm kiếm
                    {
                        $expr: {
                            $regexMatch: {
                                input: { $concat: [ { $ifNull: ["$Ho", ""] }, " ", { $ifNull: ["$Ten", ""] } ] },
                                regex: search,
                                options: "i"
                            }
                        }
                    },
                    { Ho: { $regex: search, $options: 'i' } },
                    { Ten: { $regex: search, $options: 'i' } },
                    { DienThoai: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const total = await service.collection.countDocuments(filter);
        const items = await service.collection.find(filter)
            .sort({ _id: -1 }) 
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        res.json({ items, total });
    } catch (error) {
        next(error);
    }
};

exports.findByMaDocGia = async (req, res, next) => {
    try {
        const service = new DocGiaService(MongoDB.client);
        const result = await service.findByMaDocGia(req.params.madocgia);
        if (!result) return res.status(404).send({ message: "Mã độc giả không tồn tại" });
        res.send(result);
    } catch (error) {
        next(error);
    }
};

exports.findByTenDocGia = async (req, res, next) => {
    try {
        const service = new DocGiaService(MongoDB.client);
        const result = await service.findByTenDocGia(req.params.tendocgia);
        if (!result || result.length === 0) return res.status(404).send({ message: "Không tìm thấy tên độc giả tương ứng" });
        res.send(result);
    } catch (error) {
        next(error);
    }
};

exports.findBySoDienThoai = async (req, res, next) => {
    try {
        const service = new DocGiaService(MongoDB.client);
        const result = await service.findBySoDienThoai(req.params.sodienthoai);
        if (!result || result.length === 0) return res.status(404).send({ message: "Không tìm thấy số điện thoại tương ứng" });
        res.send(result);
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const service = new DocGiaService(MongoDB.client);
        const result = await service.update(req.params.madocgia, req.body);
        res.send({ message: "Cập nhật độc giả thành công!", data: result });
    } catch (error) {
        next(error);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const service = new DocGiaService(MongoDB.client);
        const result = await service.delete(req.params.madocgia);
        res.send({ message: "Xóa độc giả thành công!", data: result });
    } catch (error) {
        next(error);
    }
};

const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

exports.changePassword = async (req, res, next) => {
    try {
        const service = new DocGiaService(MongoDB.client);
        const user = await service.findByMaDocGia(req.params.madocgia);
        if (!user) return res.status(404).send({ message: "Không tìm thấy độc giả!" });

        // Kiểm tra mật khẩu hiện tại
        const isMatch = await bcrypt.compare(req.body.currentPassword, user.MatKhau);
        if (!isMatch) {
            return res.status(400).send({ message: "Mật khẩu hiện tại không đúng!" });
        }

        // Hash mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.newPassword, salt);

        // Cập nhật mật khẩu mới
        await service.update(req.params.madocgia, { MatKhau: hashed });

        res.send({ message: "Đổi mật khẩu thành công!" });
    } catch (error) {
        next(error);
    }
};

exports.count = async (req, res, next) => {
    try {
        const service = new DocGiaService(MongoDB.client);
        const count = await service.count();
        res.send({ count });
    } catch (error) {
        next(error);
    }
};

exports.registerStats = async (req, res, next) => {
  try {
    const months = parseInt(req.query.months) || 6;
    const service = new DocGiaService(MongoDB.client);
    const stats = await service.registerStats(months);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const service = new DocGiaService(MongoDB.client);
        const madocgia = req.params.madocgia;
        const newPassword = req.body.MatKhau || '123456';
        const hashed = await bcrypt.hash(newPassword, 10);

        const result = await service.collection.updateOne(
            { MaDocGia: madocgia },
            { $set: { MatKhau: hashed } }
        );
        if (result.modifiedCount === 1) {
            res.json({ message: 'Đặt lại mật khẩu thành công!' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy độc giả!' });
        }
    } catch (error) {
        next(error);
    }
};
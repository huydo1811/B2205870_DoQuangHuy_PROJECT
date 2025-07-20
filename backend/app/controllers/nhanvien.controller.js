const MongoDB = require("../utils/mongodb.util");
const NhanVienService = require("../services/nhanvien.service");
const DocGiaService = require("../services/docgia.service");

exports.create = async (req, res, next) => {
    try {
        const service = new NhanVienService(MongoDB.client);
        const docGiaService = new DocGiaService(MongoDB.client);

        // Kiểm tra trùng Username ở Nhân Viên
        let existedUsername = await service.collection.findOne({ Username: req.body.Username });
        // Kiểm tra trùng Username ở Độc Giả nếu chưa thấy ở Nhân Viên
        if (!existedUsername) {
            existedUsername = await docGiaService.collection.findOne({ Username: req.body.Username });
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

        // Thêm trường Role mặc định là "user"
        req.body.Role = "admin";

        // Tạo mã độc giả ngẫu nhiên
        req.body.MaNhanVien = "NV" + Math.random().toString().slice(2, 12);
        const result = await service.create(req.body);
        res.send({ message: "Tạo nhân viên thành công!", data: result });
    } catch (error) {
        next(error);
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const service = new NhanVienService(MongoDB.client);
        const result = await service.findAll();
        if (!result || result.length === 0) {
            return res.status(404).send({ message: "Chưa có nhân viên nào trong hệ thống." });
        }
        res.send(result);
    } catch (error) {
        next(error);
    }
};

exports.findByMaNhanVien = async (req, res, next) => {
    try {
        const service = new NhanVienService(MongoDB.client);
        // Lấy đúng tên biến theo route
        const result = await service.findByMaNhanVien(req.params.manhanvien);
        if (!result) return res.status(404).send({ message: "Mã nhân viên không tồn tại" });
        res.send(result);
    } catch (error) {
        next(error);
    }
};

exports.findByTenNhanVien = async (req, res, next) => {
    try {
        const service = new NhanVienService(MongoDB.client);
        const result = await service.findByTenNhanVien(req.params.tennhanvien);
        if (!result || result.length === 0) return res.status(404).send({ message: "Không tìm thấy tên nhân viên tương ứng" });
        res.send(result);
    } catch (error) {
        next(error);
    }
};

exports.findBySoDienThoai = async (req, res, next) => {
    try {
        const service = new NhanVienService(MongoDB.client);
        const result = await service.findBySoDienThoai(req.params.sodienthoai);
        if (!result || result.length === 0) return res.status(404).send({ message: "Không tìm thấy số điện thoại tương ứng" });
        res.send(result);
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const service = new NhanVienService(MongoDB.client);
        const result = await service.update(req.params.manhanvien, req.body);
        res.send({ message: "Cập nhật nhân viên thành công!", data: result });
    } catch (error) {
        next(error);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const service = new NhanVienService(MongoDB.client);
        const result = await service.delete(req.params.manhanvien);
        res.send({ message: "Xóa nhân viên thành công!", data: result });
    } catch (error) {
        next(error);
    }
};

exports.count = async (req, res, next) => {
    try {
        const service = new NhanVienService(MongoDB.client);
        const count = await service.count();
        res.send({ count });
    } catch (error) {
        next(error);
    }
}
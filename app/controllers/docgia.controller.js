const MongoDB = require("../utils/mongodb.util");
const DocGiaService = require("../services/docgia.service");

exports.create = async (req, res, next) => {
    try {
        const service = new DocGiaService(MongoDB.client);

        // Kiểm tra trùng Username
        if (req.body.Username) {
            const existedUsername = await service.collection.findOne({ Username: req.body.Username });
            if (existedUsername) {
                return res.status(400).send({ message: "Username đã tồn tại!" });
            }
        }

        // Kiểm tra trùng Số điện thoại
        if (req.body.DienThoai) {
            const existedPhone = await service.collection.findOne({ DienThoai: req.body.DienThoai });
            if (existedPhone) {
                return res.status(400).send({ message: "Số điện thoại đã tồn tại!" });
            }
        }

        // Tạo mã độc giả ngẫu nhiên
        req.body.MaDocGia = "DG" + Date.now() + Math.floor(Math.random() * 1000);
        const result = await service.create(req.body);
        res.send({ message: "Tạo độc giả thành công!", data: result });
    } catch (error) {
        next(error);
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const service = new DocGiaService(MongoDB.client);
        const result = await service.findAll();
        res.send(result);
    } catch (error) {
        next(error);
    }
};

exports.findByMaDocGia = async (req, res, next) => {
    try {
        const service = new DocGiaService(MongoDB.client);
        // Lấy đúng tên biến theo route
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
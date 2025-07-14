const MongoDB = require("../utils/mongodb.util");
const SachService = require("../services/sach.service");
const NhaXuatBanService = require("../services/nhaxuatban.service");

exports.create = async (req, res, next) => {
    try {
        const sachService = new SachService(MongoDB.client);
        const nxbService = new NhaXuatBanService(MongoDB.client);

        // Kiểm tra MaNXB có tồn tại không
        const nxb = await nxbService.findByMaNXB(req.body.MaNXB);
        if (!nxb) {
            return res.status(400).send({ message: "Mã NXB không tồn tại!" });
        }
        // Tạo mã sách tự động nếu không có
        if (!req.body.MaSach) {
            // "S" + 9 số ngẫu nhiên
            req.body.MaSach = "S" + Math.random().toString().slice(2, 11);
        }

        const result = await sachService.create(req.body);
        res.send({ message: "Tạo sách thành công!", data: result });
    } catch (error) {
        next(error);
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const sachService = new SachService(MongoDB.client);
        const result = await sachService.findAll();
        if (!result || result.length === 0) {
            return res.status(404).send({ message: "Chưa có sách nào trong hệ thống." });
        }
        res.send(result);
    } catch (error) {
        next(error);
    }
};

exports.findByMaSach = async (req, res, next) => {
    try {
        const sachService = new SachService(MongoDB.client);
        const result = await sachService.findByMaSach(req.params.masach);
        if (!result) return res.status(404).send({ message: "Không tìm thấy sách" });
        res.send(result);
    } catch (error) {
        next(error);
    }
};

exports.findByMaNXB = async (req, res, next) => {
    try {
        const sachService = new SachService(MongoDB.client);
        const result = await sachService.findByMaNXB(req.params.manxb);
        res.send(result);
    } catch (error) {
        next(error);
    }
};

exports.findByTenSach = async (req, res, next) => {
    try {
        const sachService = new SachService(MongoDB.client);
        const result = await sachService.findByTenSach(req.params.tensach);
        if (!result || result.length === 0) return res.status(404).send({ message: "Không tìm thấy sách" });
        res.send(result);
    }
    catch (error) {
        next(error);
    }
}

exports.findByTacGia = async (req, res, next) => {
    try {
        const sachService = new SachService(MongoDB.client);
        const result = await sachService.findByTacGia(req.params.tacgia);
        if (!result || result.length === 0) return res.status(404).send({ message: "Không tìm thấy sách" });
        res.send(result);
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const sachService = new SachService(MongoDB.client);
        const result = await sachService.update(req.params.masach, req.body);
        res.send({ message: "Cập nhật sách thành công!", data: result });
    } catch (error) {
        next(error);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const sachService = new SachService(MongoDB.client);
        const result = await sachService.delete(req.params.masach);
        res.send({ message: "Xóa sách thành công!", data: result });
    } catch (error) {
        next(error);
    }
};
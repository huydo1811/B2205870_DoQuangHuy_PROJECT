const MongoDB = require("../utils/mongodb.util");
const NhaXuatBanService = require("../services/nhaxuatban.service");

exports.create = async (req, res, next) => {
    try {
        const service = new NhaXuatBanService(MongoDB.client);
        //Tao MaNXB tu dong
        req.body.MaNXB = "NXB" + Math.random().toString().slice(2, 9);
        const result = await service.create(req.body);
        res.send({ message: "Tạo NXB thành công!", data: result });
    } catch (error) {
        next(error);
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const service = new NhaXuatBanService(MongoDB.client);
        const result = await service.findAll();
        res.send(result);
    } catch (error) {
        next(error);
    }
};

exports.findByMaNXB = async (req, res, next) => {
    try {
        const service = new NhaXuatBanService(MongoDB.client);
        const result = await service.findByMaNXB(req.params.manxb);
        if (!result) return res.status(404).send({ message: "Không tìm thấy NXB" });
        res.send(result);
    } catch (error) {
        next(error);
    }
};

exports.findByTenNXB = async (req, res, next) => {
    try {
        const service = new NhaXuatBanService(MongoDB.client);
        const result = await service.findByTenNXB(req.params.tennxb);
        if (result.length === 0) return res.status(404).send({ message: "Không tìm thấy NXB" });
        res.send(result);
    }
    catch (error) {
        next(error);
    } 
};

exports.update = async (req, res, next) => {
    try {
        const service = new NhaXuatBanService(MongoDB.client);
        const result = await service.update(req.params.manxb, req.body);
        res.send({ message: "Cập nhật NXB thành công!", data: result });
    } catch (error) {
        next(error);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const service = new NhaXuatBanService(MongoDB.client);
        const result = await service.delete(req.params.manxb);
        res.send({ message: "Xóa NXB thành công!", data: result });
    } catch (error) {
        next(error);
    }
};
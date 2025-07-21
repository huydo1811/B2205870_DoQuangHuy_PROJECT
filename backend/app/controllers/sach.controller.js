const MongoDB = require("../utils/mongodb.util");
const SachService = require("../services/sach.service");
const NhaXuatBanService = require("../services/nhaxuatban.service");
const path = require("path");

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

exports.createWithImage = async (req, res, next) => {
    try {
        const sachService = new SachService(MongoDB.client);
        const nxbService = new NhaXuatBanService(MongoDB.client);

        const nxb = await nxbService.findByMaNXB(req.body.MaNXB);
        if (!nxb) return res.status(400).send({ message: "Mã NXB không tồn tại!" });

        if (!req.body.MaSach) {
            req.body.MaSach = "S" + Math.random().toString().slice(2, 11);
        }

        let imgPath = "";
        if (req.file) {
            imgPath = "/uploads/books/" + req.file.filename;
        }
        const sach = { ...req.body, Img: imgPath };
        const result = await sachService.create(sach);
        res.send({ message: "Tạo sách thành công!", data: result });
    } catch (error) {
        next(error);
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const sachService = new SachService(MongoDB.client);
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 7;
        const search = req.query.search || '';
        const maNXB = req.query.maNXB || '';

        // Xây dựng filter
        let filter = {};
        if (search) {
            filter.$or = [
                { TenSach: { $regex: search, $options: 'i' } },
                { TacGia: { $regex: search, $options: 'i' } }
            ];
        }
        if (maNXB) {
            filter.MaNXB = maNXB;
        }

        const total = await sachService.collection.countDocuments(filter);
        const items = await sachService.collection.find(filter)
            .sort({ _id: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        res.send({ items, total });
    } catch (error) {
        next(error);
    }
};

exports.findAllNoPaging = async (req, res, next) => {
    try {
        const sachService = new SachService(MongoDB.client);
        const result = await sachService.collection.find({})
            .sort({ _id: -1 })
            .toArray();
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
        const result = await sachService.collection.find({
            TenSach: { $regex: req.params.tensach, $options: 'i' }
        })
        .sort({ _id: -1 })
        .toArray();
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

exports.updateWithImage = async (req, res, next) => {
    try {
        const sachService = new SachService(MongoDB.client);
        let updateData = { ...req.body };
        if (req.file) {
            updateData.Img = "/uploads/books/" + req.file.filename;
        }
        const result = await sachService.update(req.params.masach, updateData);
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

exports.count = async (req, res, next) => {
    try {
        const service = new SachService(MongoDB.client);
        const count = await service.count();
        res.json({ count });
    } catch (error) {
        next(error);
    }
};
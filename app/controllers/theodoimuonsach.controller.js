const MongoDB = require("../utils/mongodb.util");
const TheoDoiMuonSachService = require("../services/theodoimuonsach.service");
const DocGiaService = require("../services/docgia.service");
const SachService = require("../services/sach.service");

exports.create = async (req, res, next) => {
    try {
        const service = new TheoDoiMuonSachService(MongoDB.client);
        const docGiaService = new DocGiaService(MongoDB.client);
        const sachService = new SachService(MongoDB.client);

        // Kiểm tra MaDocGia
        const docGia = await docGiaService.findByMaDocGia(req.body.MaDocGia);
        if (!docGia) return res.status(400).send({ message: "Mã độc giả không tồn tại!" });

        // Kiểm tra MaSach
        const sach = await sachService.findByMaSach(req.body.MaSach);
        if (!sach) return res.status(400).send({ message: "Mã sách không tồn tại!" });

        // Kiểm tra số quyển
        if (sach.SoQuyen <= 0) {
            return res.status(400).send({ message: "Sách đã được mượn hết!" });
        }

        // Tạo mã mượn sách tự động nếu chưa có
        if (!req.body.MaMuonSach) {
            req.body.MaMuonSach = "MS" + Math.random().toString().slice(2, 10);
        }

        // Xử lý trạng thái và ngày mượn/ngày trả
        const trangThai = req.body.TrangThai || "Chờ duyệt";
        req.body.TrangThai = trangThai;

        if (trangThai === "Chờ duyệt" || trangThai === "Đã duyệt") {
            req.body.NgayMuon = null;
            req.body.NgayTra = null;
        } else if (trangThai === "Đang mượn") {
            req.body.NgayMuon = new Date();
            req.body.NgayTra = null;
            // Trừ số quyển
            await sachService.update(req.body.MaSach, { SoQuyen: sach.SoQuyen - 1 });
        } else if (trangThai === "Đã trả") {
            req.body.NgayTra = new Date();
            if (!req.body.NgayMuon) req.body.NgayMuon = null;
        }

        const result = await service.create(req.body);
        res.send({ message: "Tạo phiếu mượn thành công!", data: result });
    } catch (error) {
        next(error);
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const service = new TheoDoiMuonSachService(MongoDB.client);
        const result = await service.findAll();
        if (!result || result.length === 0) {
            return res.status(404).send({ message: "Chưa có phiếu mượn nào trong hệ thống." });
        }
        res.send(result);
    } catch (error) {
        next(error);
    }
};

exports.findByMaMuonSach = async (req, res, next) => {
    try {
        const service = new TheoDoiMuonSachService(MongoDB.client);
        const result = await service.findByMaMuonSach(req.params.mamuonsach);
        if (!result) return res.status(404).send({ message: "Không tìm thấy phiếu mượn" });
        res.send(result);
    } catch (error) {
        next(error);
    }
};

exports.findByMaDocGia = async (req, res, next) => {
    try {
        const service = new TheoDoiMuonSachService(MongoDB.client);
        const result = await service.findByMaDocGia(req.params.madocgia);
        res.send(result);
    } catch (error) {
        next(error);
    }
};

exports.findByMaSach = async (req, res, next) => {
    try {
        const service = new TheoDoiMuonSachService(MongoDB.client);
        const result = await service.findByMaSach(req.params.masach);
        if (!result || result.length === 0) {
            return res.status(404).send({ message: "Không tìm thấy phiếu mượn cho mã sách này." });
        }
        res.send(result);
    }
    catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const service = new TheoDoiMuonSachService(MongoDB.client);
        const sachService = new SachService(MongoDB.client);

        // Lấy phiếu mượn hiện tại
        const current = await service.findByMaMuonSach(req.params.mamuonsach);
        if (!current) return res.status(404).send({ message: "Không tìm thấy phiếu mượn" });

        const trangThaiMoi = req.body.TrangThai || current.TrangThai;

        // Nếu chuyển từ "Đang mượn" sang "Đã trả" thì cộng lại số quyển
        if (current.TrangThai === "Đang mượn" && trangThaiMoi === "Đã trả") {
            const sach = await sachService.findByMaSach(current.MaSach);
            if (sach) {
                await sachService.update(current.MaSach, { SoQuyen: sach.SoQuyen + 1 });
            }
        }

        // Nếu chuyển từ trạng thái khác sang "Đang mượn" thì trừ số quyển
        if (current.TrangThai !== "Đang mượn" && trangThaiMoi === "Đang mượn") {
            const sach = await sachService.findByMaSach(current.MaSach);
            if (sach && sach.SoQuyen > 0) {
                await sachService.update(current.MaSach, { SoQuyen: sach.SoQuyen - 1 });
            } else {
                return res.status(400).send({ message: "Sách đã được mượn hết!" });
            }
        }

        // Xử lý ngày mượn/ngày trả như cũ
        if (trangThaiMoi === "Chờ duyệt" || trangThaiMoi === "Đã duyệt") {
            req.body.NgayMuon = null;
            req.body.NgayTra = null;
        } else if (trangThaiMoi === "Đang mượn") {
            req.body.NgayMuon = current.NgayMuon || new Date();
            req.body.NgayTra = null;
        } else if (trangThaiMoi === "Đã trả") {
            req.body.NgayMuon = current.NgayMuon || new Date();
            req.body.NgayTra = new Date();
        }

        req.body.TrangThai = trangThaiMoi;

        const result = await service.update(req.params.mamuonsach, req.body);
        res.send({ message: "Cập nhật phiếu mượn thành công!", data: result });
    } catch (error) {
        next(error);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const service = new TheoDoiMuonSachService(MongoDB.client);
        const result = await service.delete(req.params.mamuonsach);
        res.send({ message: "Xóa phiếu mượn thành công!", data: result });
    } catch (error) {
        next(error);
    }
};
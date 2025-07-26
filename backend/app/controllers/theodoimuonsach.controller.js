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
        const sachService = new SachService(MongoDB.client);

        const result = await service.findAll();
        if (!result || result.length === 0) {
            return res.status(404).send({ message: "Chưa có phiếu mượn nào trong hệ thống." });
        }
        const maSachArr = [...new Set(result.map(item => item.MaSach))];
        // Truy vấn bảng sách lấy tên sách
        const sachArr = await sachService.collection.find({ MaSach: { $in: maSachArr } }).toArray();

        const sachMap = {};
        sachArr.forEach(s => {
            sachMap[s.MaSach] = s.TenSach;
        });
        result.forEach(item => {
            item.TenSach = sachMap[item.MaSach] || '';
        });

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
        const sachService = new SachService(MongoDB.client);
        const result = await service.findByMaDocGia(req.params.madocgia);

        // Lấy danh sách mã sách
        const sachMap = {};
        for (const item of result) {
            if (!sachMap[item.MaSach]) {
                const sach = await sachService.findByMaSach(item.MaSach);
                sachMap[item.MaSach] = sach ? sach.TenSach : '';
            }
            item.TenSach = sachMap[item.MaSach];
        }

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
        const current = await service.findByMaMuonSach(req.params.mamuonsach);
        if (!current) return res.status(404).send({ message: "Không tìm thấy phiếu mượn" });

        const trangThaiMoi = req.body.TrangThai || current.TrangThai;
        if (trangThaiMoi === "Đã duyệt") {
            const allBorrows = await service.findByMaSach(current.MaSach);
            const sach = await sachService.findByMaSach(current.MaSach);
            const count = allBorrows.filter(
                b => ["Đã duyệt", "Đang mượn"].includes(b.TrangThai)
            ).length;
            if (count >= sach.SoQuyen) {
                return res.status(400).send({ message: "Sách đã hết, không thể duyệt thêm phiếu mượn!" });
            }
        }
        if (current.TrangThai !== "Đang mượn" && trangThaiMoi === "Đang mượn") {
            const sach = await sachService.findByMaSach(current.MaSach);
            if (sach && sach.SoQuyen > 0) {
                await sachService.update(current.MaSach, { SoQuyen: sach.SoQuyen - 1 });
            } else {
                return res.status(400).send({ message: "Sách đã được mượn hết!" });
            }
        }
        if (current.TrangThai === "Đang mượn" && trangThaiMoi === "Đã trả") {
            const sach = await sachService.findByMaSach(current.MaSach);
            if (sach) {
                await sachService.update(current.MaSach, { SoQuyen: sach.SoQuyen + 1 });
            }
        }
        if (trangThaiMoi === "Chờ duyệt" || trangThaiMoi === "Đã duyệt") {
            req.body.NgayMuon = null;
            req.body.NgayTra = null;
        } else if (trangThaiMoi === "Đang mượn") {
            req.body.NgayMuon = current.NgayMuon || new Date();
            req.body.NgayTra = null;
        } else if (trangThaiMoi === "Đã trả") {
            req.body.NgayMuon = current.NgayMuon || new Date();
            req.body.NgayTra = new Date();
            const ngayMuon = new Date(req.body.NgayMuon);
            const ngayTra = new Date(req.body.NgayTra);
            const soNgay = Math.ceil((ngayTra - ngayMuon) / (1000 * 60 * 60 * 24));
            const quaHan = soNgay - 14;
            req.body.TienPhat = quaHan > 0 ? quaHan * 5000 : 0; // 2000đ/ngày
        }
        if (trangThaiMoi === "Đã duyệt" && current.TrangThai !== "Đã duyệt") {
            req.body.NgayDuyet = new Date();
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

exports.countBorrowToday = async (req, res, next) => {
    try {
        const service = new TheoDoiMuonSachService(MongoDB.client);
        const count = await service.countBorrowToday();
        res.send({ message: "Số lượng phiếu mượn trong ngày hôm nay", count });
    } catch (error) {
        next(error);
    }
};

exports.borrowStats = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const stats = await service.borrowStats(days);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

exports.topBooks = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const stats = await service.topBooks(limit);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

exports.borrowStatusStats = async (req, res, next) => {
    try {
        const service = new TheoDoiMuonSachService(MongoDB.client);
        const all = await service.findAll();
        const stats = {
            'Chờ duyệt': 0,
            'Đã duyệt': 0,
            'Đang mượn': 0,
            'Đã trả': 0
        };
        all.forEach(item => {
            if (stats[item.TrangThai] !== undefined) stats[item.TrangThai]++;
        });
        res.json(stats);
    } catch (error) {
        next(error);
    }
};

exports.cancelExpiredApprovals = async (req, res, next) => {
    try {
        const service = new TheoDoiMuonSachService(MongoDB.client);
        const now = new Date();
        const expiredDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
        const expired = await service.collection.updateMany(
            {
                TrangThai: "Đã duyệt",
                NgayDuyet: { $lte: expiredDate }
            },
            { $set: { TrangThai: "Chờ duyệt", NgayDuyet: null } }
        );
        res.send({ message: "Đã hủy các phiếu duyệt quá hạn", modified: expired.modifiedCount });
    } catch (error) {
        next(error);
    }
};

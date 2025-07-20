COLLECTION = "TheodoiMuonSach";
const MongoDB = require("../utils/mongodb.util");
const { ObjectId } = require("mongodb");

class TheoDoiMuonSachService {
    constructor(client) {
        this.collection = client.db().collection(COLLECTION);
    }

    async create(payload) {
        return await this.collection.insertOne(payload);
    }

    async findAll() {
        return await this.collection.find({}).toArray();
    }

    async findByMaMuonSach(MaMuonSach) {
        return await this.collection.findOne({ MaMuonSach });
    }

    async findByMaDocGia(MaDocGia) {
        return await this.collection.find({ MaDocGia }).toArray();
    }

    async findByMaSach(MaSach) {
        return await this.collection.find({ MaSach }).toArray();
    }

    async update(MaMuonSach, payload) {
        return await this.collection.updateOne(
            { MaMuonSach },
            { $set: payload }
        );
    }

    async delete(MaMuonSach) {
        return await this.collection.deleteOne({ MaMuonSach });
    }

    async countBorrowToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        return await this.collection.countDocuments({
            TrangThai: "Đang mượn",
            NgayMuon: { $gte: today, $lt: tomorrow }
        });
    }

    async borrowStats(days = 7) {
        const result = [];
        for (let i = days - 1; i >= 0; i--) {
            const day = new Date();
            day.setHours(0, 0, 0, 0);
            day.setDate(day.getDate() - i);
            const nextDay = new Date(day);
            nextDay.setDate(day.getDate() + 1);

            const count = await this.collection.countDocuments({
            NgayMuon: { $gte: day, $lt: nextDay }
            });
            result.push({
            date: day.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
            count
            });
        }
        return result;
    }
    async topBooks(limit = 5) {
        const agg = await this.collection.aggregate([
            { $match: { TrangThai: { $in: ["Đang mượn", "Đã trả"] } } }, // Lấy cả hai trạng thái
            { $group: { _id: "$MaSach", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: "Sach", // Đảm bảo đúng tên collection, thường là "sach" (chữ thường)
                    localField: "_id",
                    foreignField: "MaSach",
                    as: "sachInfo"
                }
            },
            {
                $addFields: {
                    TenSach: { $arrayElemAt: ["$sachInfo.TenSach", 0] }
                }
            }
        ]).toArray();

        return agg.map(item => ({
            MaSach: item._id,
            TenSach: item.TenSach || item._id,
            count: item.count
        }));
    }
}

module.exports = TheoDoiMuonSachService;
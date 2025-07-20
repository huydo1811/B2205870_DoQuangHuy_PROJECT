const MongoDB = require("../utils/mongodb.util");
const { ObjectId } = require("mongodb");
const COLLECTION = "DocGia";
const bcrypt = require("bcryptjs");

class DocGiaService {
    constructor(client) {
        this.collection = client.db().collection(COLLECTION);
    }

    async create(payload) {
        // Hash password nếu có trường password
        if (payload.MatKhau || payload.Password) {
            const plain = payload.MatKhau || payload.Password;
            const salt = await bcrypt.genSalt(10);
            payload.MatKhau = await bcrypt.hash(plain, salt);
            delete payload.Password; // Xóa trường Password nếu có
        }
        return await this.collection.insertOne(payload);
    }

    async findAll() {
        return await this.collection.find({}).toArray();
    }

    async findByMaDocGia(MaDocGia) {
        return await this.collection.findOne({ MaDocGia: MaDocGia });
    }

    async findByTenDocGia(tenDocGia){
        return await this.collection.find({
            Ten: { $regex: tenDocGia, $options: "i" }
        }).toArray();
    }

    async findBySoDienThoai(soDienThoai) {
        return await this.collection.findOne({ DienThoai: soDienThoai });
    }

    async update(MaDocGia, payload) {
        return await this.collection.updateOne(
            { MaDocGia: MaDocGia },
            { $set: payload }
        );
    }

    async delete(MaDocGia) {
        return await this.collection.deleteOne({ MaDocGia: MaDocGia });
    }

    async count() {
        return await this.collection.countDocuments();
    }

        async registerStats(months = 6) {
        const result = [];
        const now = new Date();
        for (let i = months - 1; i >= 0; i--) {
            const firstDay = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const nextMonth = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 1);

            const count = await this.collection.countDocuments({
            NgayDangKy: { $gte: firstDay, $lt: nextMonth }
            });
            result.push({
            month: `${(firstDay.getMonth() + 1).toString().padStart(2, '0')}/${firstDay.getFullYear()}`,
            count
            });
        }
        return result;
    }
}

module.exports = DocGiaService;
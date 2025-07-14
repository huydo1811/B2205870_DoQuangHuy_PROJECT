const MongoDB = require("../utils/mongodb.util");
const { ObjectId } = require("mongodb");
const COLLECTION = "NhanVien";

class NhanVienService {
    constructor(client) {
        this.collection = client.db().collection(COLLECTION);
    }

    async create(payload) {
        return await this.collection.insertOne(payload);
    }

    async findAll() {
        return await this.collection.find({}).toArray();
    }

    async findByMaNhanVien(MaNhanVien) {
        return await this.collection.findOne({ MaNhanVien: MaNhanVien });
    }

    async findByTenNhanVien(tenNhanVien){
        return await this.collection.find({
            HoTen: { $regex: tenNhanVien, $options: "i" }
        }).toArray();
    }

    async findBySoDienThoai(soDienThoai) {
        return await this.collection.findOne({ DienThoai: soDienThoai });
    }

    async update(MaNhanVien, payload) {
        return await this.collection.updateOne(
            { MaNhanVien: MaNhanVien },
            { $set: payload }
        );
    }

    async delete(MaNhanVien) {
        return await this.collection.deleteOne({ MaNhanVien: MaNhanVien });
    }
}

module.exports = NhanVienService;
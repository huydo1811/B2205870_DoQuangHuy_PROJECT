const COLLECTION = "Sach";

class SachService {
    constructor(client) {
        this.collection = client.db().collection(COLLECTION);
    }

    async create(payload) {
        return await this.collection.insertOne(payload);
    }

    async findAll() {
        return await this.collection.find({}).toArray();
    }

    async findByMaSach(MaSach) {
        return await this.collection.findOne({ MaSach: MaSach });
    }

    async findByMaNXB(MaNXB) {
        return await this.collection.find({ MaNXB: MaNXB }).toArray();
    }

    async findByTenSach(tenSach) {
        return await this.collection.find({
            TenSach: { $regex: tenSach, $options: "i" }
        }).toArray();
    }

    async findByTacGia(tacGia) {
        return await this.collection.find({
            TacGia: { $regex: tacGia, $options: "i" }
        }).toArray();
    }

    async update(MaSach, payload) {
        return await this.collection.updateOne(
            { MaSach: MaSach },
            { $set: payload }
        );
    }

    async delete(MaSach) {
        return await this.collection.deleteOne({ MaSach: MaSach });
    }

    async count() {
        return await this.collection.countDocuments();
    }
}

module.exports = SachService;
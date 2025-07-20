const COLLECTION = "NhaXuatBan";

class NhaXuatBanService {
    constructor(client) {
        this.collection = client.db().collection(COLLECTION);
    }

    async create(payload) {
        return await this.collection.insertOne(payload);
    }

    async findAll() {
        return await this.collection.find({}).toArray();
    }

    async findByMaNXB(MaNXB) {
        return await this.collection.findOne({ MaNXB: MaNXB });
    }

    async findByTenNXB(tenNXB) {
        return await this.collection.find({
            TenNXB: { $regex: tenNXB, $options: "i" }
        }).toArray();
    }

    async update(MaNXB, payload) {
        return await this.collection.updateOne(
            { MaNXB: MaNXB },
            { $set: payload }
        );
    }

    async delete(MaNXB) {
        return await this.collection.deleteOne({ MaNXB: MaNXB });
    }

    async count() {
        return await this.collection.countDocuments();
    }
}

module.exports = NhaXuatBanService;
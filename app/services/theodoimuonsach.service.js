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
}

module.exports = TheoDoiMuonSachService;
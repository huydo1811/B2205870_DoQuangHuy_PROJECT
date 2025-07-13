const MongoDB = require("../utils/mongodb.util");
const { ObjectId } = require("mongodb");
const COLLECTION = "DocGia";

class DocGiaService {
    constructor(client) {
        this.collection = client.db().collection(COLLECTION);
    }

    async create(payload) {
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
}

module.exports = DocGiaService;
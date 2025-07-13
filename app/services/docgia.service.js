class LibraryService {
    constructor(client) {
        this.collection = client.db().collection("library");
    }
}

module.exports = LibraryService;
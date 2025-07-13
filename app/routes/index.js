const express = require("express");
const libraryController = require("../controllers/library.controller");
const router = express.Router();

router.get("/", (req, res) => {
    res.send({ message: "Backend Quản lý thư viện" });
});

router.get("/test", libraryController.test);

module.exports = router;
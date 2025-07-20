const express = require("express");
const nxbController = require("../controllers/nhaxuatban.controller");
const router = express.Router();

router.post("/", nxbController.create);
router.get("/", nxbController.findAll);
router.get("/count", nxbController.count); // Thêm route đếm số lượng nhà xuất bản
router.get("/:manxb", nxbController.findByMaNXB);
router.get("/ten/:tennxb", nxbController.findByTenNXB);
router.put("/:manxb", nxbController.update);
router.delete("/:manxb", nxbController.delete);

module.exports = router;
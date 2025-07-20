const express = require("express");
const sachController = require("../controllers/sach.controller");
const router = express.Router();

router.post("/", sachController.create);
router.get("/", sachController.findAll);
router.get("/count", sachController.count);
router.get("/:masach", sachController.findByMaSach);
router.get("/nxb/:manxb", sachController.findByMaNXB);
router.get("/tensach/:tensach", sachController.findByTenSach);
router.get("/tacgia/:tacgia", sachController.findByTacGia);
router.put("/:masach", sachController.update);
router.delete("/:masach", sachController.delete);

module.exports = router;
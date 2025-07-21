const express = require("express");
const sachController = require("../controllers/sach.controller");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const uploadPath = path.join(__dirname, "..", "uploads", "books");

// Cấu hình lưu file
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Tạo thư mục uploads/books nếu chưa có
const fs = require("fs");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

router.post("/", upload.single("Img"), sachController.createWithImage);
router.put("/:masach", upload.single("Img"), sachController.updateWithImage);

router.post("/", sachController.create);
router.get("/", sachController.findAll);
router.get("/all", sachController.findAllNoPaging);
router.get("/count", sachController.count);
router.get("/:masach", sachController.findByMaSach);
router.get("/nxb/:manxb", sachController.findByMaNXB);
router.get("/tensach/:tensach", sachController.findByTenSach);
router.get("/tacgia/:tacgia", sachController.findByTacGia);
router.put("/:masach", sachController.update);
router.delete("/:masach", sachController.delete);

module.exports = router;
const express = require("express");
const nhanVienController = require("../controllers/nhanvien.controller"); // Sửa lại tên biến controller
const router = express.Router();

router.post("/", nhanVienController.create);
router.get("/", nhanVienController.findAll);
router.get("/count", nhanVienController.count); 
router.get("/ten/:tennhanvien", nhanVienController.findByTenNhanVien);
router.get("/:manhanvien", nhanVienController.findByMaNhanVien);
router.get("/sdt/:sodienthoai", nhanVienController.findBySoDienThoai);
router.put("/:manhanvien", nhanVienController.update);
router.put("/:manhanvien/password", nhanVienController.changePassword);
router.delete("/:manhanvien", nhanVienController.delete);

module.exports = router;
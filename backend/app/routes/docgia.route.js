const express = require("express");
const docGiaController = require("../controllers/docgia.controller"); 
const router = express.Router();

router.post("/", docGiaController.create);
router.get("/", docGiaController.findAll);
router.get("/count", docGiaController.count); 
router.get('/register-stats', docGiaController.registerStats);
router.get("/ten/:tendocgia", docGiaController.findByTenDocGia);
router.get("/madocgia/:madocgia", docGiaController.findByMaDocGia);
router.get("/sdt/:sodienthoai", docGiaController.findBySoDienThoai);
router.put("/:madocgia", docGiaController.update);
router.delete("/:madocgia", docGiaController.delete);
router.put("/:madocgia/password", docGiaController.changePassword);
router.put("/:madocgia/reset-password", docGiaController.resetPassword);

module.exports = router;
const express = require("express");
const controller = require("../controllers/theodoimuonsach.controller");
const router = express.Router();

router.post("/", controller.create);
router.get("/", controller.findAll);
router.get("/:mamuonsach", controller.findByMaMuonSach);
router.get("/docgia/:madocgia", controller.findByMaDocGia);
router.get("/sach/:masach", controller.findByMaSach);
router.put("/:mamuonsach", controller.update);
router.delete("/:mamuonsach", controller.delete);

module.exports = router;
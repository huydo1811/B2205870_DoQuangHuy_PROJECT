const express = require("express");
const controller = require("../controllers/theodoimuonsach.controller");
const router = express.Router();

router.post("/", controller.create);
router.post('/cancel-expired-approvals', controller.cancelExpiredApprovals);
router.get("/", controller.findAll);
router.get("/count-borrow-today", controller.countBorrowToday);
router.get('/borrow-stats', controller.borrowStats);
router.get('/top-books', controller.topBooks);
router.get('/status-stats', controller.borrowStatusStats);
router.get("/:mamuonsach", controller.findByMaMuonSach);
router.get("/docgia/:madocgia", controller.findByMaDocGia);
router.get("/sach/:masach", controller.findByMaSach);
router.put("/:mamuonsach", controller.update);
router.delete("/:mamuonsach", controller.delete);

module.exports = router;
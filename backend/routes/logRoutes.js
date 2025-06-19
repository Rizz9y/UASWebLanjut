const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");
const { verifyAuthToken } = require("../middleware/authMiddleware");
const { checkRole } = require("../middleware/roleMiddleware");

router.get(
  "/",
  verifyAuthToken,
  checkRole(["admin"]), // Hanya Admin yang bisa melihat log
  logController.getRecentLogs
);

module.exports = router;

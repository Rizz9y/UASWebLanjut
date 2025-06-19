const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyAuthToken } = require("../middleware/authMiddleware");
const { checkRole } = require("../middleware/roleMiddleware");

router.post(
  "/staff",
  verifyAuthToken,
  checkRole(["admin"]),
  userController.createStaffAccount
);

router.get(
  "/staff",
  verifyAuthToken,
  checkRole(["admin"]),
  userController.getAllStaffAccounts
);

router.put(
  "/staff/:id",
  verifyAuthToken,
  checkRole(["admin"]),
  userController.updateStaffAccount
);

router.delete(
  "/staff/:id",
  verifyAuthToken,
  checkRole(["admin"]),
  userController.deleteStaffAccount
);

module.exports = router;

const express = require("express");
const { protect, authorize } = require("../middleware/protect");

const {
  register,
  login,
  logout,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
} = require("../controller/users");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

router.use(protect);

// api/users
router
  .route("/")
  .get(authorize("admin", "teacher"), getUsers)
  .post(authorize("admin"), createUser);
router
  .route("/:id")
  .get(authorize("admin", "teacher"), getUser)
  .put(authorize("admin"), updateUser)
  .delete(authorize("admin"), deleteUser);

module.exports = router;

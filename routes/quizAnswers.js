const express = require("express");
const { protect, authorize } = require("../middleware/protect");

const {
  getAnswers,
  getAnswer,
  createAnswer,
  deleteAnswer,
} = require("../controller/quizAnswers");

const router = express.Router();

// api/questions
router
  .route("/")
  .get(getAnswers)
  .post(protect, authorize("admin", "teacher", "student"), createAnswer);

router
  .route("/:id")
  .get(getAnswer)
  .delete(protect, authorize("admin", "teacher", "student"), deleteAnswer);

module.exports = router;

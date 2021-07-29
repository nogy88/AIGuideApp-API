const express = require("express");
const { protect, authorize } = require("../middleware/protect");

const {
  getQuestions,
  getQuestion,
  createQuestion,
  deleteQuestion,
  updateQuestion,
} = require("../controller/questions");

const router = express.Router();

// api/questions
router
  .route("/")
  .get(getQuestions)
  .post(protect, authorize("admin", "teacher"), createQuestion);

router
  .route("/:id")
  .get(getQuestion)
  .delete(protect, authorize("admin", "teacher"), deleteQuestion)
  .put(protect, authorize("admin", "teacher"), updateQuestion);

module.exports = router;

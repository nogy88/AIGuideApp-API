const express = require("express");
const { protect, authorize } = require("../middleware/protect");

const {
  getQuizs,
  getQuiz,
  createQuiz,
  deleteQuiz,
  updateQuiz,
} = require("../controller/quizs");

const router = express.Router();

// Заагдсан Quiz-н Questions-г авах
const { getQuizQuestions } = require("../controller/questions");
router.route("/:quizId/questions").get(getQuizQuestions);

// Заагдсан Quiz-н Answers-г авах
const { getQuizAnswers } = require("../controller/quizAnswers");
router.route("/:quizId/answers").get(getQuizAnswers);

// api/quizs
router
  .route("/")
  .get(getQuizs)
  .post(protect, authorize("admin", "teacher"), createQuiz);

router
  .route("/:id")
  .get(getQuiz)
  .delete(protect, authorize("admin", "teacher"), deleteQuiz)
  .put(protect, authorize("admin", "teacher"), updateQuiz);

module.exports = router;

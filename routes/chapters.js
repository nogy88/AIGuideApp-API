const express = require("express");
const { protect, authorize } = require("../middleware/protect");

const {
  getChapters,
  getChapter,
  createChapter,
  updateChapter,
  deleteChapter,
  uploadChapterPhoto,
} = require("../controller/chapters");

const router = express.Router();

const { getChapterLessons } = require("../controller/lessons");
router.route("/:chapterId/lessons").get(getChapterLessons);

const { getChapterQuizs } = require("../controller/quizs");
router.route("/:chapterId/quizs").get(getChapterQuizs);

router.route("/").get(getChapters).post(protect, createChapter);

router
  .route("/:id")
  .get(getChapter)
  .put(protect, authorize("admin", "teacher"), updateChapter)
  .delete(protect, authorize("admin", "teacher"), deleteChapter);

router
  .route("/:id/photo")
  .put(protect, authorize("admin", "teacher"), uploadChapterPhoto);

module.exports = router;

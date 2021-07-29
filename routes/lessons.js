const express = require("express");
const { protect, authorize } = require("../middleware/protect");

const {
  getLessons,
  getLesson,
  createLesson,
  deleteLesson,
  updateLesson,
  uploadLessonFile,
} = require("../controller/lessons");

const router = express.Router();

// api/lessons/
router
  .route("/")
  .get(getLessons)
  .post(protect, authorize("admin", "teacher"), createLesson);

router
  .route("/:id")
  .get(getLesson)
  .delete(protect, authorize("admin", "teacher"), deleteLesson)
  .put(protect, authorize("admin", "teacher"), updateLesson);

router
  .route("/:id/file")
  .put(protect, authorize("admin", "teacher"), uploadLessonFile);

module.exports = router;

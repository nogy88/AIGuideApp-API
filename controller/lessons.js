const Lesson = require("../models/Lesson");
const path = require("path");
const Chapter = require("../models/Chapter");
const myError = require("../utils/myError");
const asyncHandler = require("../middleware/asyncHandler");

// api/lessons
exports.getLessons = asyncHandler(async (req, res, next) => {
  const lessons = await Lesson.find().populate({
    path: "chapter",
    select: "name",
  });

  res.status(200).json({
    success: true,
    count: lessons.length,
    data: lessons,
  });
});

// api/chapters/:chapterId/lessons
exports.getChapterLessons = asyncHandler(async (req, res, next) => {
  const lessons = await Lesson.find({ chapter: req.params.chapterId });

  res.status(200).json({
    success: true,
    count: lessons.length,
    data: lessons,
  });
});

exports.getLesson = asyncHandler(async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    throw new myError(req.params.id + " ID=тай lesson байхгүй байна.", 404);
  }

  res.status(200).json({
    success: true,
    data: lesson,
  });
});

exports.createLesson = asyncHandler(async (req, res, next) => {
  const chapter = await Chapter.findById(req.body.chapter);

  if (!chapter) {
    throw new myError(req.body.chapter + " ID-тай chapter байхгүй!", 400);
  }

  req.body.createdUser = req.userId;

  const lesson = await Lesson.create(req.body);

  res.status(200).json({
    success: true,
    data: lesson,
  });
});

exports.deleteLesson = asyncHandler(async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    throw new myError(req.params.id + " ID-тай lesson байхгүй!", 400);
  }

  lesson.remove();

  res.status(200).json({
    success: true,
    data: lesson,
    deletedUser: req.userId,
  });
});

exports.updateLesson = asyncHandler(async (req, res, next) => {
  const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!lesson) {
    throw new myError(req.params.id + " ID-тай lesson байхгүй!", 400);
  }

  res.status(200).json({
    success: true,
    data: lesson,
  });
});

// PUT:  api/lessons/:id/file
exports.uploadLessonFile = asyncHandler(async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    throw new myError(req.params.id + " ID-тай lesson байхгүй!", 400);
  }

  // lesson file upload (pdf, word, excel, ppt)
  const file = req.files.file;

  // if (!file.mimetype.startsWith("image")) {
  //   throw new myError("Та зураг upload хийнэ үү!", 400);
  // }

  // if (file.size > process.env.MAX_UPLOAD_FILE_SIZE) {
  //   throw new myError("Та зурагны хэмжээ хэтэрсэн байна!", 400);
  // }

  file.name = `lesson_${req.params.id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.LESSON_FILE_UPLOAD_PATH}/${file.name}`, (err) => {
    if (err) {
      throw new myError(
        "Файлыг upload хийх явцад алдаа гарлаа! Алдаа: " + err.message,
        400
      );
    }

    lesson.file = file.name;
    lesson.save();

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

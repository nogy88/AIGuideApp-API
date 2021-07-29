const Quiz = require("../models/Quiz");
const path = require("path");
const Chapter = require("../models/Chapter");
const myError = require("../utils/myError");
const asyncHandler = require("../middleware/asyncHandler");

// api/quizs
exports.getQuizs = asyncHandler(async (req, res, next) => {
  const quizs = await Quiz.find().populate({
    path: "chapter",
    select: "name",
  });

  res.status(200).json({
    success: true,
    count: quizs.length,
    data: quizs,
  });
});

// api/chapters/:chapterId/quizs
exports.getChapterQuizs = asyncHandler(async (req, res, next) => {
  const quizs = await Quiz.find({ chapter: req.params.chapterId });

  res.status(200).json({
    success: true,
    count: quizs.length,
    data: quizs,
  });
});

// api/quizs/:id
exports.getQuiz = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    throw new myError(req.params.id + " ID-тай quiz байхгүй байна.", 404);
  }

  res.status(200).json({
    success: true,
    data: quiz,
  });
});

// POST:  api/quizs
exports.createQuiz = asyncHandler(async (req, res, next) => {
  const chapter = await Chapter.findById(req.body.chapter);

  if (!chapter) {
    throw new myError(req.body.chapter + " ID-тай chapter байхгүй!", 400);
  }

  req.body.createdUser = req.userId;

  const quiz = await Quiz.create(req.body);

  res.status(200).json({
    success: true,
    data: quiz,
  });
});

// DELETE:  api/quizs
exports.deleteQuiz = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    throw new myError(req.params.id + " ID-тай quiz байхгүй!", 400);
  }

  quiz.remove();

  res.status(200).json({
    success: true,
    data: quiz,
    deletedUser: req.userId,
  });
});

// PUT:  api/quizs
exports.updateQuiz = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!quiz) {
    throw new myError(req.params.id + " ID-тай quiz байхгүй!", 400);
  }

  res.status(200).json({
    success: true,
    data: quiz,
  });
});

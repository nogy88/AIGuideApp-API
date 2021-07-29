const Question = require("../models/Question");
const path = require("path");
const Quiz = require("../models/Quiz");
const myError = require("../utils/myError");
const asyncHandler = require("../middleware/asyncHandler");

// api/questions
exports.getQuestions = asyncHandler(async (req, res, next) => {
  const questions = await Question.find().populate({
    path: "quiz",
    select: "name",
  });

  res.status(200).json({
    success: true,
    count: questions.length,
    data: questions,
  });
});

// api/quizs/:quizId/questions
exports.getQuizQuestions = asyncHandler(async (req, res, next) => {
  const questions = await Question.find({ quiz: req.params.quizId });

  res.status(200).json({
    success: true,
    count: questions.length,
    data: questions,
  });
});

// api/questions/:id
exports.getQuestion = asyncHandler(async (req, res, next) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    throw new myError(req.params.id + " ID-тай асуулт байхгүй байна.", 404);
  }

  res.status(200).json({
    success: true,
    data: question,
  });
});

// POST:  api/questions
exports.createQuestion = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.body.quiz);

  if (!quiz) {
    throw new myError(req.body.chapter + " ID-тай Quiz байхгүй!", 400);
  }

  req.body.createdUser = req.userId;

  const question = await Question.create(req.body);

  res.status(200).json({
    success: true,
    data: question,
  });
});

// DELETE:  api/questions
exports.deleteQuestion = asyncHandler(async (req, res, next) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    throw new myError(req.params.id + " ID-тай Асуулт байхгүй!", 400);
  }

  question.remove();

  res.status(200).json({
    success: true,
    data: question,
  });
});

// PUT:  api/questions
exports.updateQuestion = asyncHandler(async (req, res, next) => {
  const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!question) {
    throw new myError(req.params.id + " ID-тай Асуулт байхгүй!", 400);
  }

  res.status(200).json({
    success: true,
    data: question,
  });
});

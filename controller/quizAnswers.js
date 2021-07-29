const QuizAnswer = require("../models/QuizAnswer");
const path = require("path");
const Quiz = require("../models/Quiz");
const myError = require("../utils/myError");
const asyncHandler = require("../middleware/asyncHandler");

// api/answers
exports.getAnswers = asyncHandler(async (req, res, next) => {
  const answers = await QuizAnswer.find().populate({
    path: "quiz",
    select: "name",
  });

  res.status(200).json({
    success: true,
    count: answers.length,
    data: answers,
  });
});

// api/quizs/:quizId/answers
exports.getQuizAnswers = asyncHandler(async (req, res, next) => {
  const answers = await QuizAnswer.find({ quiz: req.params.quizId });

  res.status(200).json({
    success: true,
    count: answers.length,
    data: answers,
  });
});

// api/answers/:id
exports.getAnswer = asyncHandler(async (req, res, next) => {
  const answer = await QuizAnswer.findById(req.params.id).populate({
    path: "quiz",
    select: "name",
  });

  if (!answer) {
    throw new myError(req.params.id + " ID-тай хариулт байхгүй байна.", 404);
  }

  res.status(200).json({
    success: true,
    data: answer,
  });
});

// POST:  api/answers
exports.createAnswer = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.body.quiz);

  if (!quiz) {
    throw new myError(req.body.chapter + " ID-тай Quiz байхгүй!", 400);
  }

  req.body.answeredUser = req.userId;

  // score tootsooloh
  let total = 0;
  req.body.userSelectedAnswers.map((el) => {
    el.answerIsCorrect && total++;
  });

  req.body.score = total;

  const answer = await QuizAnswer.create(req.body);

  res.status(200).json({
    success: true,
    data: answer,
  });
});

// DELETE:  api/answers
exports.deleteAnswer = asyncHandler(async (req, res, next) => {
  const answer = await QuizAnswer.findById(req.params.id).populate({
    path: "quiz",
    select: "name",
  });

  if (!answer) {
    throw new myError(req.params.id + " ID-тай хариулт байхгүй!", 400);
  }

  answer.remove();

  res.status(200).json({
    success: true,
    data: answer,
  });
});

// // PUT:  api/answers
// exports.updateanswer = asyncHandler(async (req, res, next) => {
//   const answer = await QuizAnswer.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!answer) {
//     throw new myError(req.params.id + " ID-тай Асуулт байхгүй!", 400);
//   }

//   res.status(200).json({
//     success: true,
//     data: answer,
//   });
// });

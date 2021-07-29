const mongoose = require("mongoose");

const QuizAnswerScheme = new mongoose.Schema(
  {
    userSelectedAnswers: {
      type: Array,
      required: [true, "Хариултуудаа оруулна уу!"],
    },

    quiz: {
      type: mongoose.Schema.ObjectId,
      ref: "Quiz",
      required: true,
    },

    score: {
      type: String,
    },

    answeredUser: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("QuizAnswer", QuizAnswerScheme);

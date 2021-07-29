const mongoose = require("mongoose");

const QuestionScheme = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Асуултаа оруулна уу!"],
      unique: true,
      trim: true,
      maxlength: [150, "Асуултын урт дээд тал нь 150 тэмдэгт байх ёстой!"],
    },

    correct_answer: String,

    incorrect_answers: [String],

    type: {
      type: String,
      required: [true, "Асуултын төрлийг оруулна уу"],
      enum: ["choice", "text"],
      default: "choice",
    },

    image: String,

    quiz: {
      type: mongoose.Schema.ObjectId,
      ref: "Quiz",
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("Question", QuestionScheme);

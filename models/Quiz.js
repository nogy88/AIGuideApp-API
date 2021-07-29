const mongoose = require("mongoose");

const QuizScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Quiz-н нэрийг оруулна уу!"],
      unique: true,
      trim: true,
      maxlength: [60, "Quiz-н нэрний урт дээд тал нь 60 тэмдэгт байх ёстой!"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [150, "Тайлбарын урт дээд тал нь 150 тэмдэгт байх ёстой!"],
    },

    chapter: {
      type: mongoose.Schema.ObjectId,
      ref: "Chapter",
      required: true,
    },

    createdUser: {
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

// LessonScheme.virtual("admin").get(function () {
//   return "Finn";
// });
module.exports = mongoose.model("Quiz", QuizScheme);

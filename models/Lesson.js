const mongoose = require("mongoose");

const LessonScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Lesson-н нэрийг оруулна уу!"],
      unique: true,
      trim: true,
      maxlength: [60, "Lesson-н нэрний урт дээд тал нь 60 тэмдэгт байх ёстой!"],
    },

    file: {
      type: String,
      // required: [true, "Хичээлийн файлын замыг зааж өгнө үү!"],
      default: "http://www.africau.edu/images/default/sample.pdf",
    },

    chapter: {
      type: mongoose.Schema.ObjectId,
      ref: "Chapter",
      required: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [150, "Тайлбарын урт дээд тал нь 150 тэмдэгт байх ёстой!"],
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
module.exports = mongoose.model("Lesson", LessonScheme);

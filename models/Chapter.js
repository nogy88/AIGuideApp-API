const mongoose = require("mongoose");

const ChapterScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      maxlength: [
        40,
        "Chapter-н нэрний урт дээд тал нь 40 тэмдэгт байх ёстой!",
      ],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [150, "Тайлбарын урт дээд тал нь 150 тэмдэгт байх ёстой!"],
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ChapterScheme.virtual("lessons", {
  ref: "Lesson",
  localField: "_id",
  foreignField: "chapter",
  justOne: false,
});

ChapterScheme.pre("remove", async function (next) {
  // console.log("removing...".inverse);
  await this.model("Lesson").deleteMany({ chapter: this._id });
  await this.model("Quiz").deleteMany({ chapter: this._id });
  next();
});

ChapterScheme.pre("save", function (next) {
  // console.log("pre chapter...");
  next();
});

module.exports = mongoose.model("Chapter", ChapterScheme);

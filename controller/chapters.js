const Chapter = require("../models/Chapter");
const path = require("path");
const myError = require("../utils/myError");
const asyncHandler = require("../middleware/asyncHandler");

exports.getChapters = asyncHandler(async (req, res, next) => {
  const chapters = await Chapter.find(req.query).populate("lessons");

  res.status(200).json({
    success: true,
    count: chapters.length,
    data: chapters,
  });
});

exports.getChapter = asyncHandler(async (req, res, next) => {
  const chapter = await Chapter.findById(req.params.id).populate("lessons");

  if (!chapter) {
    throw new myError(req.params.id + " ID-тай chapter байхгүй!", 400);
  }

  res.status(200).json({
    success: true,
    data: chapter,
  });
});

exports.createChapter = asyncHandler(async (req, res, next) => {
  const chapter = await Chapter.create(req.body);

  res.status(200).json({
    success: true,
    data: chapter,
  });
});

exports.updateChapter = asyncHandler(async (req, res, next) => {
  const chapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!chapter) {
    throw new myError(req.params.id + " ID-тай chapter байхгүй!", 400);
  }

  res.status(200).json({
    success: true,
    data: chapter,
  });
});

exports.deleteChapter = asyncHandler(async (req, res, next) => {
  const chapter = await Chapter.findById(req.params.id);

  if (!chapter) {
    throw new myError(req.params.id + " ID-тай chapter байхгүй!", 400);
  }

  chapter.remove();

  res.status(200).json({
    success: true,
    data: chapter,
  });
});

// PUT:  api/chapter/:id/photo
exports.uploadChapterPhoto = asyncHandler(async (req, res, next) => {
  const chapter = await Chapter.findById(req.params.id);

  if (!chapter) {
    throw new myError(req.params.id + " ID-тай lesson байхгүй!", 400);
  }

  // chapter photo upload
  const file = req.files.file;

  if (!file.mimetype.startsWith("image")) {
    throw new myError("Та зураг upload хийнэ үү!", 400);
  }

  // if (file.size > process.env.MAX_UPLOAD_FILE_SIZE) {
  //   throw new myError("Та зурагны хэмжээ хэтэрсэн байна!", 400);
  // }

  file.name = `photo_${req.params.id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.CHAPTER_PHOTO_UPLOAD_PATH}/${file.name}`, (err) => {
    if (err) {
      throw new myError(
        "Файлыг upload хийх явцад алдаа гарлаа! Алдаа: " + err.message,
        400
      );
    }

    chapter.photo = file.name;
    chapter.save();

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

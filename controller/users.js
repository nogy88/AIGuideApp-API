const User = require("../models/User");
const myError = require("../utils/myError");
const asyncHandler = require("../middleware/asyncHandler");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

// register
exports.register = asyncHandler(async (req, res, next) => {
  // static - general oilgolt
  const user = await User.create(req.body);

  // method - todorhoi neg
  const token = user.getJsonWebToken();

  res.status(200).json({
    success: true,
    token,
    user: user,
  });
});

// login
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // check input
  if (!email || !password) {
    throw new myError("Имэйл болон нууц үгээ дамжуулна уу!", 400);
  }

  // search user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new myError("Имэйл болон нууц үгээ зөв оруулна уу!", 401);
  }

  // call check password method
  const ok = await user.checkPassword(password);

  if (!ok) {
    throw new myError("Имэйл болон нууц үгээ зөв оруулна уу!", 401);
  }

  const token = user.getJsonWebToken();

  const cookieOption = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };

  res.status(200).cookie("aiguideapp-token", token, cookieOption).json({
    success: true,
    token,
    user: user,
  });
});

exports.logout = asyncHandler(async (req, res, next) => {
  const cookieOption = {
    expires: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.status(200).cookie("aiguideapp-token", null, cookieOption).json({
    success: true,
    data: "logged out......",
  });
});

exports.getUsers = asyncHandler(async (req, res, next) => {
  // console.log(req.query);
  const users = await User.find(req.query);

  res.status(200).json({
    success: true,
    data: users,
  });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new myError(req.params.id + " ID-тай хэрэглэгч байхгүй!", 400);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new myError(req.params.id + " ID-тай хэрэглэгч байхгүй!", 400);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new myError(req.params.id + " ID-тай хэрэглэгч байхгүй!", 400);
  }

  user.remove();

  res.status(200).json({
    success: true,
    data: user,
  });
});

//
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  if (!req.body.email) {
    throw new myError("Нууц үг сэргээх имэйл хаягаа дамжуулна уу!", 400);
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw new myError(req.body.email + " имэйлтэй хэрэглэгч олдсонгүй!", 400);
  }

  const resetToken = user.generatePasswordResetToken();
  await user.save();

  // Имэйл илгээх
  const link = `https://aiguideapp.ml/changepassword/${resetToken}`;
  const message = `<h2>Сайн байна уу?<h2><br>Таны нууц үг сэргээх хүсэлтийг хүлээн авлаа. Доорх линк дээр дарж нууц үгээ солино уу.<br><br><a target="_blanks" href="${link}">${link}</a>`;

  const info = await sendEmail({
    email: user.email,
    subject: "Нууц үг өөрчлөх хүсэлт",
    message,
  });

  console.log("Message sent: %s", info.messageId);

  res.status(200).json({
    success: true,
    resetToken,
    message,
  });
});

//

exports.resetPassword = asyncHandler(async (req, res, next) => {
  if (!req.body.resetToken || !req.body.password) {
    throw new myError("Токен болон нууц үгээ дамжуулна уу!", 400);
  }

  const encryptedToken = crypto
    .createHash("sha256")
    .update(req.body.resetToken)
    .digest("hex");

  console.log(encryptedToken + "============================");
  const user = await User.findOne({
    resetPasswordToken: encryptedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new myError("Токен хүчингүй байна!", 400);
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = user.getJsonWebToken();

  res.status(200).json({
    success: true,
    token,
    user,
  });
});

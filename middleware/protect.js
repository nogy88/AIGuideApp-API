const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const myError = require("../utils/myError");
const User = require("../models/User");

exports.protect = asyncHandler(async (req, res, next) => {
  let token = null;

  if (!req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies) {
    token = req.cookies["aiguideapp-token"];
  }

  if (!token) {
    throw new myError(
      "Энэ үйлдлийг хийхэд таны эрх хүрэхгүй байна. Та эхлээд ЛОГИН хийнэ үү!",
      401
    );
  }

  const tokenObj = jwt.verify(token, process.env.JWT_SECRET);

  req.userId = tokenObj.id;
  req.userRole = tokenObj.role;

  next();
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      throw new myError(
        "Таны эрх [" +
          req.userRole +
          "] энэ үйлдлийг хийхэд хүрэлцэхгүй байна!",
        403
      );
    }

    next();
  };
};

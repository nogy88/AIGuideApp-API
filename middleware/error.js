const errorHandler = (err, req, res, next) => {
  console.log(err.stack.cyan.underline);

  const error = { ...err };

  error.message = err.message;

  // if (error.name === "CastError") {
  //   error.message = "Энэ ID буруу бүтэцтэй байна!";
  //   error.statusCode = 400;
  // }

  if (
    error.message.startsWith(
      "User validation failed: password: Path `password`"
    )
  ) {
    error.message = `Нууц үг доод тал нь ${error.errors.password.properties.minlength} урттай байх ёстой!`;
    error.statusCode = 401;
  }

  if (error.name === "JsonWebTokenError" && error.message === "invalid token") {
    error.message = "Буруу токен дамжуулсан байна!";
    error.statusCode = 400;
  }

  if (error.code === 11000) {
    error.message = `${error.keyValue.name} талбарын утгыг давхардуулж өгч болохгүй!`;
    error.statusCode = 400;
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error,
  });
};

module.exports = errorHandler;

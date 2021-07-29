const express = require("express");
const dotenv = require("dotenv");
var path = require("path");
var rfs = require("rotating-file-stream");
const connectDB = require("./config/db");
const colors = require("colors");
const errorHandler = require("./middleware/error");
var morgan = require("morgan");
const logger = require("./middleware/logger");
const fileupload = require("express-fileupload");
var cors = require("cors");
var cookieParser = require("cookie-parser");

//Router оруулж ирэх
const chaptersRoutes = require("./routes/chapters");
const lessonsRoutes = require("./routes/lessons");
const quizsRoutes = require("./routes/quizs");
const questionsRoutes = require("./routes/questions");
const quizAnswers = require("./routes/quizAnswers");
const usersRoutes = require("./routes/users");

//Аппын тохиргоог process.env рүү ачааллах
dotenv.config({ path: "./config/config.env" });

const app = express();

connectDB();

// create a rotating write stream
const accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
});

// var whitelist = ['http://localhost:8000']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

// Body parser -> req.body
// req.cookies
app.use(cookieParser());
app.use(logger);
app.use(express.json());
app.use(cors());
app.use(fileupload());
app.use(morgan("combined", { stream: accessLogStream }));
app.use("/uploads/chapters", express.static("uploads/chapters"));
app.use("/uploads/lessons", express.static("uploads/lessons"));
app.use("/api/chapters/", chaptersRoutes);
app.use("/api/lessons/", lessonsRoutes);
app.use("/api/quizs/", quizsRoutes);
app.use("/api/questions/", questionsRoutes);
app.use("/api/answers/", quizAnswers);
app.use("/api/users/", usersRoutes);
app.use(errorHandler);

const server = app.listen(
  process.env.PORT,
  console.log(
    `Express server starting ${process.env.PORT} порт дээр аслаа`.rainbow
  )
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Алдаа гарлаа : ${err.message}`.underline.red.bold);
  server.close(() => {
    process.exit(1);
  });
});

// http://127.0.0.1:8000/uploads/chapters/photo_6076f93c3159173440e2f3f6.jpg

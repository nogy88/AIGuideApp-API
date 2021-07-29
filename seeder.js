const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Chapter = require("./models/Chapter");
const Lesson = require("./models/Lesson");
const Quiz = require("./models/Quiz");
const Question = require("./models/Question");
const User = require("./models/User");
const QuizAnswer = require("./models/QuizAnswer");
const colors = require("colors");

dotenv.config({ path: "./config/config.env" });

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const chapters = JSON.parse(
  fs.readFileSync(__dirname + "/data/chapters.json", "utf-8")
);

const lessons = JSON.parse(
  fs.readFileSync(__dirname + "/data/lessons.json", "utf-8")
);

const quizs = JSON.parse(
  fs.readFileSync(__dirname + "/data/quizs.json", "utf-8")
);

const questions = JSON.parse(
  fs.readFileSync(__dirname + "/data/questions.json", "utf-8")
);
// const quizAnswers = JSON.parse(
//   fs.readFileSync(__dirname + "/data/quizAnswers.json", "utf-8")
// );

const users = JSON.parse(
  fs.readFileSync(__dirname + "/data/users.json", "utf-8")
);

const importData = async () => {
  try {
    await User.create(users);
    await Chapter.create(chapters);
    await Lesson.create(lessons);
    await Quiz.create(quizs);
    await Question.create(questions);
    console.log("Өгөгдлийг бүгдийг импортоллоо...".rainbow);
  } catch (err) {
    console.log("import FAILED".red);
  }
};

const deleteData = async () => {
  try {
    await Chapter.deleteMany();
    await Lesson.deleteMany();
    await Quiz.deleteMany();
    await Question.deleteMany();
    await QuizAnswer.deleteMany();
    await User.deleteMany();
    console.log("Өгөгдлийг бүгдийг устгалаа...".rainbow);
  } catch (err) {
    console.log(err.red);
  }
};

if (process.argv[2] == "-i") {
  importData();
} else if (process.argv[2] == "-d") {
  deleteData();
}

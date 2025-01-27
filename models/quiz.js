import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  country: String,
  capital: String
});

const quiz = mongoose.model("quiz", quizSchema);

export default quiz;

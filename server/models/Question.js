//models/Question.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const questionSchema = new Schema(
    {
      question: { type: String, required: true },
      incorrectOptions: { type: [String], required: true },
      correctOption: { type: String, required: true },
      order: { type: Number, required: true },
    }
  );

module.exports = mongoose.model("Question", questionSchema);
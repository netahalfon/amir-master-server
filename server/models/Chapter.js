// models/Chapters.js
const mongoose = require("mongoose");
const { Schema, Types } = mongoose;


const chapterSchema = new Schema({
  type: {
    type: String,
    enum: ["completion", "rephrasing", "reading"],
    required: true,
  },
  title: { type: String }, //only if reading
  passage: { type: String }, //only if reading
  questions: [{ 
    type: Types.ObjectId, 
    ref: "Question" 
  }],
  order: { type: Number },
  simulationId: { type: Types.ObjectId, ref: "Simulation" },//only if simulation
});
module.exports = mongoose.model("Chapter", chapterSchema );

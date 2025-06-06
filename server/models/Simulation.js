// models/Simulations.js
const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const simulationSchema = new Schema({
  order: { type: Number, required: true, unique: true },
  chaptersSection1: [{ type: Types.ObjectId, ref: "Chapter" }],
  chaptersSection2: [{ type: Types.ObjectId, ref: "Chapter" }],
  type: {
    type: String,
    enum: ["Psychometrics", "Amirnet"],
    required: true,
  },
  name: { type: String, required: true },
});

module.exports = mongoose.model("Simulations", simulationSchema);

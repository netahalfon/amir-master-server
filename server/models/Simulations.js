// models/Simulations.js
const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const simulationsSchema = new Schema({
  order: { type: Number, required: true, unique: true },
  chapters: [{ type: Types.ObjectId, ref: "Chapter" }],
});
module.exports = mongoose.model("Simulations", simulationsSchema);

const mongoose = require('mongoose');

const simulationResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  simulationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Simulation' },
  score: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SimulationResult', simulationResultSchema);

const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  statement: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Easy"
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Problem", problemSchema);

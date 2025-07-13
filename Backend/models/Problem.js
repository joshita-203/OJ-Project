const mongoose = require("mongoose");

// Sub-schema for test cases
const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
    required: true,
  },
});

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    statement: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 🔹 Use correct casing
      required: true,
    },
    testCases: [testCaseSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Problem", problemSchema);

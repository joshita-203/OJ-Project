const express = require("express");
const router = express.Router();
const Problem = require("../models/Problem");
const verifyToken = require("../middleware/verifyToken");

// Create a new problem (only logged-in users)
router.post("/problems", verifyToken, async (req, res) => {
  const { title, statement, difficulty } = req.body;
  try {
    const problem = await Problem.create({
      title,
      statement,
      difficulty,
      createdBy: req.user.id
    });
    res.status(201).json(problem);
  } catch (err) {
    console.error("Create error:", err);
    res.status(500).json({ message: "Error creating problem" });
  }
});

// Get all problems (public)
router.get("/problems", async (req, res) => {
  try {
    const problems = await Problem.find().populate("createdBy", "firstname lastname email");
    res.json(problems);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Error fetching problems" });
  }
});

// Update a problem (only owner)
router.put("/problems/:id", verifyToken, async (req, res) => {
  try {
    const cleanId = req.params.id.trim();
    const problem = await Problem.findById(cleanId);

    if (!problem) return res.status(404).json({ message: "Problem not found" });

    if (problem.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    Object.assign(problem, req.body);
    await problem.save();
    res.json(problem);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error during update" });
  }
});

// Delete a problem (only owner)
router.delete("/problems/:id", verifyToken, async (req, res) => {
  try {
    const cleanId = req.params.id.trim();
    const problem = await Problem.findById(cleanId);

    if (!problem) {
      console.log("❌ Problem not found for ID:", cleanId);
      return res.status(404).json({ message: "Problem not found" });
    }

    if (problem.createdBy.toString() !== req.user.id) {
      console.log("❌ Unauthorized delete attempt by user:", req.user.id);
      return res.status(403).json({ message: "Unauthorized" });
    }

    console.log("✅ Deleting problem:", problem._id);
    await problem.deleteOne(); // ✅ Better than remove()
    res.json({ message: "Problem deleted" });
  } catch (err) {
    console.error("🔥 Delete error:", err);
    res.status(500).json({ message: "Server error during delete" });
  }
});

module.exports = router;

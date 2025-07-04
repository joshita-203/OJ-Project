const express = require("express");
const router = express.Router();
const Problem = require("../models/Problem");
const authMiddleware = require("../middleware/authMiddleware");

// 🔹 Create Problem
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, statement, difficulty } = req.body;
        const problem = await Problem.create({
            title,
            statement,
            difficulty,
            createdBy: req.user._id,
        });
        res.status(201).json(problem);
    } catch (err) {
        res.status(500).json({ error: "Failed to create problem" });
    }
});

// 🔹 Get All Problems
router.get("/", async (req, res) => {
    try {
        const problems = await Problem.find().populate("createdBy", "firstname lastname email");
        res.json(problems);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch problems" });
    }
});

// 🔹 Get a Single Problem by ID
router.get("/:id", async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id).populate("createdBy", "firstname lastname email");
        if (!problem) {
            return res.status(404).json({ error: "Problem not found" });
        }
        res.json(problem);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch problem" });
    }
});

// 🔹 Update Problem (only by creator)
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) return res.status(404).send("Problem not found");

        if (problem.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).send("You can only update your own problems");
        }

        Object.assign(problem, req.body);
        await problem.save();
        res.json(problem);
    } catch (err) {
        res.status(500).json({ error: "Failed to update problem" });
    }
});

// 🔹 Delete Problem (only by creator)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) return res.status(404).send("Problem not found");

        if (problem.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).send("You can only delete your own problems");
        }

        await problem.deleteOne();
        res.send("Problem deleted successfully");
    } catch (err) {
        res.status(500).json({ error: "Failed to delete problem" });
    }
});

module.exports = router;

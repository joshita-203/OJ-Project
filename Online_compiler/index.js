const express = require("express");
const cors = require("cors");
const generateFile = require("./generateFile");
const executeCpp = require("./executeCpp");

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("⚙️ Online Compiler Running");
});

// ✅ Run code without test case (used for "Run" button)
app.post("/run", async (req, res) => {
    const { language = 'cpp', code } = req.body;

    if (!code) {
        return res.status(400).json({ success: false, error: "Empty code body" });
    }

    try {
        const filePath = generateFile(language, code);
        const output = await executeCpp(filePath);
        res.json({ success: true, output });
    } catch (error) {
        console.error("Execution error:", error);
        res.status(500).json({ success: false, error: error.stderr || error.message });
    }
});

// ✅ Submit code and test against all testCases (used for "Submit" button)
app.post("/submit", async (req, res) => {
    const { language = 'cpp', code, testCases = [] } = req.body;

    if (!code || testCases.length === 0) {
        return res.status(400).json({ success: false, error: "Code and test cases required" });
    }

    try {
        const filePath = generateFile(language, code);
        const results = [];

        for (const test of testCases) {
            const actualOutput = await executeCpp(filePath, test.input);
            const cleanedOutput = actualOutput.trim().replace(/\r/g, "");
            const expected = test.expectedOutput.trim().replace(/\r/g, "");

            results.push({
                input: test.input,
                expected: expected,
                actual: cleanedOutput,
                passed: cleanedOutput === expected
            });
        }

        const allPassed = results.every(r => r.passed);

        res.json({ success: true, results, allPassed });
    } catch (error) {
        console.error("Submit error:", error);
        res.status(500).json({ success: false, error: error.stderr || error.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Compiler server running on port ${PORT}`);
});

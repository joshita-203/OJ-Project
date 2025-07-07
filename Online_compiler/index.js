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

// ✅ Run code with optional input
app.post("/run", async (req, res) => {
  const { language = 'cpp', code, input = "" } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, error: "Empty code body" });
  }

  try {
    const filePath = generateFile(language, code);
    const output = await executeCpp(filePath, input);
    res.json({ success: true, output });
  } catch (error) {
    console.error("Execution error:", error);
    res.status(500).json({ success: false, error: error.stderr || error.message });
  }
});

// ✅ Submit code with server-side test cases
app.post("/submit", async (req, res) => {
  const { language = 'cpp', code, testCases = [] } = req.body;

  if (!code || testCases.length === 0) {
    return res.status(400).json({ success: false, error: "Code and test cases are required" });
  }

  try {
    const filePath = generateFile(language, code);
    let allPassed = true;
    const results = [];

    for (const test of testCases) {
      const actualOutput = await executeCpp(filePath, test.input);

      const cleanedOutput = actualOutput
        .trim()
        .replace(/\r/g, "")
        .replace(/\n/g, "")
        .replace(/\s+/g, " ");

      const expected = test.expectedOutput
        .trim()
        .replace(/\r/g, "")
        .replace(/\n/g, "")
        .replace(/\s+/g, " ");

      const passed = cleanedOutput === expected;

      results.push({
        input: test.input,
        expected,
        actual: cleanedOutput,
        passed,
      });

      if (!passed) allPassed = false;
    }

    res.json({ success: true, allPassed, results });
  } catch (error) {
    console.error("Submit error:", error);
    res.status(500).json({ success: false, error: error.stderr || error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Compiler server running on port ${PORT}`);
});

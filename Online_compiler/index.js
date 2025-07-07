const express = require("express");
const cors = require("cors");
const generateFile = require("./generateFile");
const executeCode = require("./executeCode");

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("⚙️ Online Compiler Running");
});

// ✅ /run - Executes with custom input or fallback to 1st test case
app.post("/run", async (req, res) => {
  const { language = "cpp", code, input = "", testCases = [] } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, error: "Empty code body" });
  }

  const finalInput = input.trim()
    ? input
    : testCases.length > 0
    ? testCases[0].input
    : "";

  try {
    const filePath = generateFile(language, code);
    const output = await executeCode(filePath, finalInput);
    res.json({ success: true, output });
  } catch (error) {
    console.error("Execution error:", error);
    res.status(500).json({ success: false, error: error.stderr || error.message });
  }
});

// ✅ /submit - Test case based validation
app.post("/submit", async (req, res) => {
  const { language = "cpp", code, testCases = [] } = req.body;

  if (!code || testCases.length === 0) {
    return res.status(400).json({ success: false, error: "Code and test cases are required" });
  }

  try {
    const filePath = generateFile(language, code);
    let allPassed = true;
    const results = [];

    for (const test of testCases) {
      const actualOutput = await executeCode(filePath, test.input);

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

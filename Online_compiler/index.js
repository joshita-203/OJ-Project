const express = require("express");
const cors = require("cors");
const generateFile = require("./generateFile");
const executeCode = require("./executeCode");
const generateAiResponse = require("./generateAiResponse");

const app = express();
const PORT = process.env.PORT || 8000;

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
    return res.status(400).json({ success: false, output: "❌ Code is empty" });
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
    const combinedError = [error?.error, error?.stderr]
      .filter(Boolean)
      .join("\n")
      .trim() || "❌ Unknown error";

    res.status(200).json({
      success: false,
      output: combinedError
    });
  }
});

// ✅ /submit - Runs on all test cases securely
app.post("/submit", async (req, res) => {
  const { language = "cpp", code, testCases = [] } = req.body;

  if (!code || testCases.length === 0) {
    return res.status(400).json({ success: false, output: "❌ Code and test cases required" });
  }

  try {
    const filePath = generateFile(language, code);
    let allPassed = true;

    for (const test of testCases) {
      let actualOutput = "";
      try {
        actualOutput = await executeCode(filePath, test.input);
      } catch (error) {
        const combinedError = [error?.error, error?.stderr]
          .filter(Boolean)
          .join("\n")
          .trim() || "❌ Unknown error";

        return res.status(200).json({
          success: false,
          allPassed: false,
          output: combinedError
        });
      }

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

      if (cleanedOutput !== expected) {
        allPassed = false;
        break;
      }
    }

    return res.status(200).json({ success: true, allPassed });
  } catch (error) {
    console.error("Submit error:", error);
    const combinedError = [error?.error, error?.stderr]
      .filter(Boolean)
      .join("\n")
      .trim() || "❌ Unknown error";

    return res.status(200).json({
      success: false,
      allPassed: false,
      output: combinedError
    });
  }
});

// ✅ /ai-review - OpenAI-based code feedback
app.post("/ai-review", async (req, res) => {
  const { code } = req.body;

  if (!code || code.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "❌ Empty code! Please provide some code to review."
    });
  }

  try {
    const aiResponse = await generateAiResponse(code);
    res.json({ success: true, review: aiResponse });
  } catch (error) {
    console.error("AI review error:", error.message);
    res.status(500).json({
      success: false,
      review: "❌ AI review failed due to internal error."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Compiler server running on port ${PORT}`);
});

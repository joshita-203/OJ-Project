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

// Run code with optional input
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

// Submit code (secure — test cases are not sent to frontend)
app.post("/submit", async (req, res) => {
  const { language = 'cpp', code } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, error: "Code is required" });
  }

  try {
    const filePath = generateFile(language, code);

    // ✅ Example test cases stored securely on server
    const testCases = [
      { input: "3 5", expected: "8" },
      { input: "4 8", expected: "12" },
    ];

    let allPassed = true;

    for (const test of testCases) {
      const actualOutput = await executeCpp(filePath, test.input);
      const cleanedOutput = actualOutput.trim().replace(/\r/g, "");
      const expected = test.expected.trim().replace(/\r/g, "");

      if (cleanedOutput !== expected) {
        allPassed = false;
        break;
      }
    }

    res.json({ success: true, allPassed });
  } catch (error) {
    console.error("Submit error:", error);
    res.status(500).json({ success: false, error: error.stderr || error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Compiler server running on port ${PORT}`);
});

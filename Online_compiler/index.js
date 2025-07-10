const express = require("express");
const cors = require("cors");
const generateFile = require("./generateFile");
const executeCode = require("./executeCode");
const generateAiResponse = require("./generateAiResponse");

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

// ✅ /submit - Secure Test case based validation (no test case exposure)
app.post("/submit", async (req, res) => {
  const { language = "cpp", code, testCases = [] } = req.body;

  if (!code || testCases.length === 0) {
    return res.status(400).json({ success: false, error: "Code and test cases are required" });
  }

  try {
    const filePath = generateFile(language, code);
    let allPassed = true;

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

      if (cleanedOutput !== expected) {
        allPassed = false;
        break; // Stop checking further if one fails
      }
    }

    // 🔐 Do not send test case data in response
    return res.json({ success: true, allPassed });
  } catch (error) {
    console.error("Submit error:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.post("/ai-review",async (req,res) => {
      const{code}=req.body;
      if(code==undefined||code.trim() === ''){
        return res.status(400).json({
             success:false,
             error: "Empty code! Please provide some code to execute."
        });
      }
      try {
        const aiResponse = await generateAiResponse(code);
        res.json({
             success: true,
             review: aiResponse
        });
      } catch (error) {
        console.error('Error executing code:',error.message);
      }
});

app.listen(PORT, () => {
  console.log(`✅ Compiler server running on port ${PORT}`);
});

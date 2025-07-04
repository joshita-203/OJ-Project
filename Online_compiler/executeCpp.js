const fs = require("fs");
const path = require("path");
const { exec, spawn } = require("child_process");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = async (filepath, input = "") => {
  const jobId = path.basename(filepath).split(".")[0];
  const outputFilename = `${jobId}.exe`;
  const outPath = path.join(outputPath, outputFilename);

  return new Promise((resolve, reject) => {
    // Step 1: Compile the C++ code
    exec(`g++ "${filepath}" -o "${outPath}"`, (compileErr, stdout, stderr) => {
      if (compileErr || stderr) {
        return reject({ error: compileErr, stderr });
      }

      // Step 2: Run the compiled executable with spawn
      const run = spawn(outPath);

      let output = "";
      let errorOutput = "";

      run.stdout.on("data", (data) => {
        output += data.toString();
      });

      run.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      run.on("close", (code) => {
        if (code !== 0) {
          return reject({ error: `Runtime error with exit code ${code}`, stderr: errorOutput });
        } else {
          return resolve(output.trim());
        }
      });

      // Step 3: Pass input to the program
      if (input) {
        run.stdin.write(input);
      }
      run.stdin.end();
    });
  });
};

module.exports = executeCpp;

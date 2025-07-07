const fs = require("fs");
const path = require("path");
const { exec, spawn } = require("child_process");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCode = async (filepath, input = "") => {
  const ext = path.extname(filepath);
  const jobDir = path.dirname(filepath);
  const jobId = path.basename(filepath).split(".")[0];

  return new Promise((resolve, reject) => {
    // ✅ C++
    if (ext === ".cpp") {
      const outputFile = path.join(outputPath, `${jobId}.exe`);
      exec(`g++ "${filepath}" -o "${outputFile}"`, (compileErr, stdout, stderr) => {
        if (compileErr || stderr) return reject({ error: compileErr, stderr });

        const run = spawn(outputFile);
        let output = "", errorOutput = "";

        run.stdout.on("data", data => output += data.toString());
        run.stderr.on("data", data => errorOutput += data.toString());

        run.on("close", code => {
          if (code !== 0) return reject({ error: `Runtime error with exit code ${code}`, stderr: errorOutput });
          resolve(output.trim());
        });

        if (input) run.stdin.write(input + "\n");
        run.stdin.end();
      });
    }

    // ✅ Python
    else if (ext === ".py") {
      const run = spawn("python", [filepath]);
      let output = "", errorOutput = "";

      run.stdout.on("data", data => output += data.toString());
      run.stderr.on("data", data => errorOutput += data.toString());

      run.on("close", code => {
        if (code !== 0) return reject({ error: `Runtime error with exit code ${code}`, stderr: errorOutput });
        resolve(output.trim());
      });

      if (input) run.stdin.write(input + "\n");
      run.stdin.end();
    }

    // ✅ Java
    else if (ext === ".java") {
      const classname = "Main";
      exec(`javac "${filepath}"`, (compileErr, stdout, stderr) => {
        if (compileErr || stderr) return reject({ error: compileErr, stderr });

        const run = spawn("java", ["-cp", jobDir, classname]);
        let output = "", errorOutput = "";

        run.stdout.on("data", data => output += data.toString());
        run.stderr.on("data", data => errorOutput += data.toString());

        run.on("close", code => {
          if (code !== 0) return reject({ error: `Runtime error with exit code ${code}`, stderr: errorOutput });
          resolve(output.trim());
        });

        if (input) run.stdin.write(input + "\n");
        run.stdin.end();
      });
    }

    // ❌ Unsupported language
    else {
      reject({ error: "Unsupported language" });
    }
  });
};

module.exports = executeCode;

// @ts-check

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const fileNames = [];

resolveFiles();
function resolveFiles(dir = "") {
  const p = path.join(__dirname, "..", "src", dir);

  const files = fs.readdirSync(p);
  files.forEach((file) => {
    const filePath = `${p}/${file}`;
    if (fs.statSync(filePath).isDirectory()) {
      if (file == "@types") return;
      resolveFiles(file);
    } else if (file.endsWith(".ts")) {
      fileNames.push(filePath);
    }
  });
}

fileNames.forEach((filename) => {
  const [cmd, ...args] = `yarn mlogjs ${filename} --watch`.split(" ");
  const child = spawn(cmd, args, {
    shell: true,
    stdio: "inherit",
    env: { PATH: process.env.PATH },
  });

  child.on("exit", (code) => {
    if (code === 0) {
      console.log(`Command executed successfully`);
    } else {
      console.error(`Error executing command, exited with code ${code}`);
    }
  });
});

// @ts-check

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const fileNames = fs.readdirSync(path.resolve(__dirname, "../src")).filter((filename) => filename.endsWith(".ts"));
fileNames.forEach((filename) => {
  const [cmd, ...args] = `yarn mlogjs src/${filename} --watch`.split(" ");
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

// @ts-check

const childProcess = require("child_process");
childProcess.exec("yarn dev", function (error, stdout, stderr) {
  console.log(stdout);
  console.log(stderr);
  console.log(error ?? "");
});

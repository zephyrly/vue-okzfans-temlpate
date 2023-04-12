const program = require("commander")
const init = require('../inquirer/index');
const downloadFun = require("../core/download.js");
program.version('1.1.0')
function getFramwork (val) {
  console.log(val);
}
const myhelp = function (program) {
  program.option('-f --framwork <framork> [other...]', '设置框架', getFramwork)
}
const createProgress = function (program) {
  program.command('create <progress> [other...]')
    .alias('crt')
    .description('创建项目')
    .action((progress, arg) => {
      init();
    })
}
const downloadUrl = function (program) {
  program.command('download <url> [...other]')
    .description('下载内容')
    .action((url, ...args) => {
      console.log(args);
      downloadFun(url, args[1].args[1])
    })
}
myhelp(program);
downloadUrl(program);
createProgress(program)
program.parse(process.argv)
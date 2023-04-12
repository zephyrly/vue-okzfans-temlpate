const download = require('download-git-repo');
  const ora = require("ora");
  const chalk = require("chalk");
  const figlet = require("figlet");
  const modifyPackageJson = require("./action")
  
  function handleAsync (params) {
    const JAVASCRIPT = figlet.textSync('JAVASCRIPT', {
      font: 'big',
      horizontalLayout: 'fitted',
      verticalLayout: 'controlled smushing',
      width: 600,
      whitespaceBreak: true
    }, function (err, data) {
      if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
      }
      console.log(data);
    });
    console.log(chalk.blue.bold(JAVASCRIPT));
  }
  
  const downloadFun = (url, option) => {
    const spinner = ora("Loading unicorns").start()
    spinner.text = chalk.blue("下载中");
    
    download(url, option.projectName, { clone: true }, function (err) {
      if (err) {
        spinner.fail("下载失败!");
        handleAsync()
      } else {
        spinner.succeed(chalk.red("下载成功!"))
        console.log(chalk.blue(`cd ${option.projectName}`))
        console.log(chalk.red("npm install"))
        console.log(chalk.yellow(`npm run dev`))
        modifyPackageJson(option)
        handleAsync()
      }
    })
  }
  module.exports = downloadFun;
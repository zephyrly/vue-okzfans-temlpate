const inquirer = require("inquirer");
  const downloadFun = require("../core/download.js");
  const frameworkConfig = {
    front: "https://gitlab.com/flippidippi/download-git-repo-fixture.git",
    manager: "https://gitlab.com/flippidippi/download-git-repo-fixture.git"
  }
  const config = {};
  
  function getFramework () {
    return inquirer.prompt([
      {
        type: 'list',
        name: 'framework',
        choices: ["front", "manager"],
        message: "请选择你所使用的框架"
      }
    ]).then((answer) => {
      return answer.framework;
    })
  }
  
  function getProjectName () {
    return inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: '项目名称',
        filter (input) {
          return input.trim();
        },
      }
    ]).then((answer) => {
      console.log(answer, "FDsfs");
      return answer.projectName;
    })
  }
  
  function getIsEslint () {
    return inquirer.prompt([
      {
        type: 'confirm',
        name: 'isIslint',
        message: '是否使用eslint校验格式?'
      }
    ]).then((answer) => {
      return answer.isIslint;
    })
  }
  
  async function init () {
    config.projectName = await getProjectName();
    config.framework = await getFramework();
    config.isIslint = await getIsEslint();
    let url = config.framework == "front" ? frameworkConfig.front : frameworkConfig.manager;
    downloadFun("direct:" + url, config);
  }
  module.exports = init;
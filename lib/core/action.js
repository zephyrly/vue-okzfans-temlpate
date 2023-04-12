const fs = require('fs');
const path = require("path");
const handlebars = require("handlebars");
  function modifyPackageJson (options) {
    let downloadPath = options.projectName;
    const packagePath = path.join(downloadPath, 'package.json');
    console.log(packagePath, "packagePath");
    
    //判断是否存在package.json文件
    if (fs.existsSync(packagePath)) {
      let content = fs.readFileSync(packagePath).toString();
      
      //判断是否选择了eslint
      if (options.isIslint) {
        let targetContent = JSON.parse(content);
        content = JSON.stringify(targetContent);
        targetContent.dependencies.eslint = "^1.0.0";
        console.log("content", content);
      }
      
      //写入模板
      const template = handlebars.compile(content);
      const param = { name: options.projectName };
      const result = template(param);
      
      //重新写入package.json文件
      fs.writeFileSync(packagePath, result);
      console.log('modify package.json complate');
    } else {
      throw new Error('no package.json');
    }
  }
  module.exports = modifyPackageJson;
"use strict";
const path = require("path");
const defaultSettings = require("./src/settings.js");
const env = require("@/config/env.json");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const name = env.title || "vue okzfans Template"; // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9527; // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: process.env.NODE_ENV === "development",
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    // before: require("./mock/mock-server.js"),
    proxy: {
      [env.api.basePath]: {
        target:
          env.api.host.indexOf("http") >= 0
            ? `${env.api.host}/`
            : `https://${env.api.host}/`,
        changeOrigin: true, // needed for virtual hosted sites
        ws: true, // proxy websockets
        pathRewrite: {
          ["^" + env.api.basePath]: "",
        },
      },
    },
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        "@": resolve("src"),
        api: resolve("src/apis"),
        common: resolve("src/common"),
      },
    },
  },
  chainWebpack(config) {
    // chainWebpack to alias
    // config.resolve.alias
    //   .set("@", resolve("src"))
    //   .set("api", resolve("src/apis"))
    //   .set("common", resolve("src/common"));

    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin("preload").tap(() => [
      {
        rel: "preload",
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: "initial",
      },
    ]);

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete("prefetch");

    // set svg-sprite-loader svg转精灵图
    const types = ["svg", "icons"];
    types.forEach((type) => {
      config.module
        .rule("")
        .test(/\.svg$/) // 匹配svg文件
        .include.add(resolve(`src/${type}`)) // 主要匹配src/svg
        .end()
        .use("svg-sprite-loader")
        .loader("svg-sprite-loader") // 使用的loader，主要要npm该插件
        .options({ symbolId: "icon-[name]" }); // 参数配置
    });

    config.module
      .rule("images")
      .use("url-loader")
      .tap((options) => ({
        name: "./assets/images/[name].[ext]",
        quality: 85,
        limit: 0,
        esModule: false,
      }));

    // config.entryPoints.clear(); // 清空默认入口
    // config.entry('test').add(getPath('./test/main.ts')); // 重新设置

    config.when(process.env.NODE_ENV !== "development", (config) => {
      config.output.filename("./js/[name].[chunkhash:8].js");
      config.output.chunkFilename("./js/[name].[chunkhash:8].js");
      config.plugin("extract-css").tap((args) => [
        {
          filename: "css/[name].[contenthash:8].css",
          chunkFilename: "css/[name].[contenthash:8].css",
        },
      ]);
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/,
          },
        ])
        .end();

      // delete console.log
      config.optimization
        .minimize(true)
        .minimizer("terser")
        .tap((args) => {
          let { terserOptions } = args[0];
          terserOptions.compress.drop_console = true;
          terserOptions.compress.drop_debugger = true;
          return args;
        });

      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial", // only package third parties that are initially dependent
          },
          elementUI: {
            name: "chunk-elementUI", // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // in order to adapt to cnpm
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      });
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk("single");
    });
  },
};

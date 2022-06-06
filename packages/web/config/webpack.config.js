// const path = require("path");
// const rpgVillageCore = "../../core/";
// const tsconfig = require(path.resolve(__dirname, rpgVillageCore, "tsconfig.json"));

// const rpgVillageDist = path.resolve(__dirname, rpgVillageCore, "dist");

module.exports = {
  entry: ["./src/main.tsx"],

  mode: "production",

  output: {
    filename: "bundle.js",
    path: __dirname + "/public",
  },

  devtool: "source-map",

  resolve: {
    extensions: [".webpack.js", ".web.js", ".js", ".ts", ".tsx"],
    // alias: Object.keys(tsconfig.compilerOptions.paths).reduce((aliases, aliasName) => {
    //   const aliasBase = aliasName.slice(0, -2);
    //   const pathBase = tsconfig.compilerOptions.paths[aliasName][0].slice(0, -2);

    //   return { ...aliases, [aliasBase]: `${rpgVillageDist}/${pathBase}` };
    // }, {}),
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.tsx?$/,
        use: ["ts-loader"],
      },
      {
        test: /\.svg$/,
        use: ["svg-url-loader"],
      },
    ],
  },
};

module.exports = {
  entry: ["./src/main.tsx"],

  mode: 'production',

  output: {
    filename: "bundle.js",
    path: __dirname + "/public"
  },

  devtool: "source-map",

  resolve: {
    extensions: [".webpack.js", ".web.js", ".js", ".ts", ".tsx"]
  },

  module: {
    rules: [{
      test: /\.scss$/,
      use: ["style-loader", "css-loader", "sass-loader"]
    }, {
      test: /\.tsx?$/,
      use: ["ts-loader"]
    },
    {
      test: /\.svg$/,
      use: ['svg-url-loader'],
    },]
  }
};
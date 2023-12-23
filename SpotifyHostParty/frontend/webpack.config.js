const path = require("path");
const webpack = require("webpack");

module.exports = ( env, argv ) => {
  // https://stackoverflow.com/questions/66772358/webpack-warning-warning-in-defineplugin-conflicting-values-for-process-env-no
  // `mode` is `'XX'` if you ran webpack like so: `webpack watch --mode XX` (v5 syntax)
  const mode = argv.mode || 'development'; // dev mode by default

  return {
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "./static/frontend"),
      filename: "[name].js",
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
      ],
    },
    optimization: {
      minimize: true,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV' : JSON.stringify(mode)
      })
    ],
  };
};
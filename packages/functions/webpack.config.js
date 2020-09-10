const path = require("path")
const PnpWebpackPlugin = require(`pnp-webpack-plugin`)

const isProduction = typeof NODE_ENV !== "undefined" && NODE_ENV === "production"
const mode = isProduction ? "production" : "development"
const devtool = isProduction ? false : "inline-source-map"
module.exports = {
  entry: [
    "./src/submission-created.ts"
  ],
  target: "node",
  mode,
  devtool,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader"
      }
    ]
  },
  resolve: {
    extensions: [ ".ts", ".js" ],
    plugins: [
      PnpWebpackPlugin
    ]
  },
  output: {
    filename: "submission-created.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: 'commonjs'
  },
  node: false,
  optimization: {
    minimize: false
  },
  resolveLoader: {
    plugins: [
      PnpWebpackPlugin.moduleLoader(module)
    ]
  }
}

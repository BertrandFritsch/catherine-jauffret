const path = require("path")
const PnpWebpackPlugin = require(`pnp-webpack-plugin`)

const isProduction = typeof NODE_ENV !== "undefined" && NODE_ENV === "production"
const mode = isProduction ? "production" : "development"
const devtool = isProduction ? false : "inline-source-map"
module.exports = {
  entry: [
    "./src/postGuestbookEntry.ts"
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
    filename: "postGuestbookEntry.js",
    path: path.resolve(__dirname, "dist")
  },
  node: {
    __dirname: false,
    __filename: false
  },
  resolveLoader: {
    plugins: [
      PnpWebpackPlugin.moduleLoader(module)
    ]
  }
}

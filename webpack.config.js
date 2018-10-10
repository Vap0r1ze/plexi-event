const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  entry: path.join(__dirname, 'src', 'index.js'),
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  module: {
    rules: [{
      test: /\.scss$/,
      use: [ 'style-loader', 'css-loader', 'postcss-loader', 'sass-loader' ]
    }]
  },
  output: {
    path: path.join(__dirname, 'public', 'dist'),
    filename: 'game.js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'public')
  }
}

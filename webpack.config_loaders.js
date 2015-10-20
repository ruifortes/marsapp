var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = [
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    loader: 'babel-loader?stage=0'
  },
  {
    test: /\.styl$/,
    loader: ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader')
  },
  // {
  //   test: /\.styl$/,
  //   loader: 'style-loader!css-loader!stylus-loader'
  // },
  {
    test: /\.less$/,
    loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
  },
  {
    test: /\.css$/,
    loader: 'style-loader!css-loader'
  },
  {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader?sourceMap')
  },
  {
    test: /\.(otf|eot|svg|ttf|woff|woff2)$/,
    loader: 'url-loader?limit=8192&name=./fonts/[name].[ext]'
  },
  {
    test: /\.json$/,
    loader: 'json-loader'
  }
]

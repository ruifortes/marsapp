var ExtractIconsCss = require('extract-text-webpack-plugin')

module.exports = {
  // entry: {
  //   myIcons: './client/icons/config.font.js',
  // },
  entry: './client/icons/config.font.js',
  output: {
    path         : 'client/icons/fonts/',
    publicPath   : 'fonts/',
    filename     : '[name].js', //will be overwritten by ExtractTextPlugin
  },
  module: {
    loaders: [
      {
        test: /\.font.(js|json)$/,
        // loader: ExtractIconsCss.extract('style', 'css!sass!fontgen') //?types=woff,eot,ttf"
        loader: ExtractIconsCss.extract('style', 'fontgen')
      }
      // ,{
      //   test: /\.(woff|eot|ttf|svg)$/,
      //   loader: "url"
      // }
      ,{
          test: /\.css$/,
          loader: 'raw'
      }
    ]
  },
  plugins: [
    new ExtractIconsCss('[name].css')
  ]
}

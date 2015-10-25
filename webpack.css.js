var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
    styles:'./client/css/main.scss',
  },
  output: {
    path         : __dirname + '/public',
    library      : 'MarsWeather',
    filename     : '[name].css'
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        // loader: 'style-loader!css-loader!sass-loader?sourceMap'
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader?sourceMap')
      }
    ]
  },
  devtool: 'source-map',
  externals: {
    'react': 'React',
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new ExtractTextPlugin('[name].css')
  ]
}

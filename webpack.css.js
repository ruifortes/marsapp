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
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2)$/,
        // loader: 'url-loader?limit=8192&name=./fonts/[name].[ext]'
        loader: 'url-loader?limit=1000&name=./fonts/[name].[ext]'
      },
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

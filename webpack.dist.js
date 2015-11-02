var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
    main:'./client/app.jsx',
    // styles:'./client/css/main.scss'
  },
  output: {
    path         : __dirname + '/public',
    libraryTarget: 'umd',
    library      : 'MarsWeather',
    filename     : '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader?stage=0'
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader?sourceMap')
        // loader: ExtractTextPlugin.extract('css-loader', 'sass-loader?sourceMap')
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2)$/,
        // loader: 'url-loader?limit=8192&name=./fonts/[name].[ext]'
        loader: 'url-loader?limit=1000&name=./fonts/[name].[ext]'
      },
    ]
  },
  // devtool: 'source-map',
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new ExtractTextPlugin('[name].css')
  ]
}

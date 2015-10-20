module.exports = {
  // entry: './src/js/index.jsx',
  entry: {
    main:'./client/app.jsx',
  },
  output: {
    path         : __dirname + '/public',
    libraryTarget: 'umd',
    library      : 'MarsWeather',
    filename     : '[name].js'
  },
  module: {
    loaders: require('./webpack.config_loaders')
  },
  devtool: 'source-map',
  externals: {
    'react': 'React',
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}
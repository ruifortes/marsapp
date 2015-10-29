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
    loaders: require('./webpack.loaders')
  },
  devtool: 'source-map',
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}

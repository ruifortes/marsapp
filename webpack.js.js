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
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader?stage=0'
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader?sourceMap'
      },
    ]
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

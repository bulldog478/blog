'use strict';
var webpack = require('webpack'),
  path = require('path');

// PATHS
var PATHS = {
  app: __dirname + '/app',
  bower: __dirname + '/app/bower_components'
};

module.exports = {
  context: path.join(__dirname, 'app'),
  entry: {
    app: ['webpack/hot/dev-server', './core/bootstrap.js']
  },
  output: {
    path: PATHS.app,
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.less$/,
      loader: 'style!css!less'
    }, {
      test: /\.js$/,
      loader: 'ng-annotate!babel?presets[]=es2015!jshint',
      exclude: /node_modules|bower_components/
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
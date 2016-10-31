var webpack = require('webpack');
var slds = require('copy-webpack-plugin');
var path = require('path');
var openbrowser = require('open-browser-webpack-plugin');
var autoprefixer = require('autoprefixer');
var faker = require('faker');

module.exports = {
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  entry: {
    app: './src/main.js',
    vendor: ['angular']
  },
  output: {
    path: './dist',
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    // NOTE: This is only for offline mocks
    new webpack.ProvidePlugin({
      'faker': 'faker'
    }),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
    new slds([
      { from: './src/mocks.js', to: './mocks.js'},
      { from: './node_modules/faker/build/build/faker.js', to: '.'},
      { from: './node_modules/@salesforce-ux/design-system/assets', to: './assets'}
      ], {
          ignore: [
              'README',
              '*.txt',
              '*.html',
              'fonts/*.ttf',
              'fonts/webfonts/*.svg',
              'fonts/webfonts/*.eot',
              'icons!(-sprite)/*/*.svg',
              'styles/*.css',
              'icons/*/*.png'
          ]
      }),
    new openbrowser({url: 'http://localhost:4444'})
  ],
  devServer: {
    inline: true,
    contentBase: './dist',
    historyApiFallback: true,
    port: 4444
  },
  devTool: 'source-map',
  module: {
    loaders: [
      { test: /\.(woff|woff2)$/,  loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf$/,    loader: "file-loader" },
      { test: /\.eot$/,    loader: "file-loader" },
      { test: /\.svg$/,    loader: "file-loader" },
      {
        // This is Scss > autoprefixer > css > style compilers
        test: /\.scss$/,
        exclude: /(node_modules|bower_components)/,
        loaders: [
            'style',
            'css',
            'autoprefixer?browsers=last 2 versions'
        ]
      },
      {
        // This is Babel js ES6 to ES5 compiler
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        // This allows you to require a template as a filename
        test: /\.html$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'raw-loader'
      }],
    sassLoader: {
        outputStyle: 'compressed'
    },
    noParse: [path.join(__dirname, 'node_modules', 'angular', 'bundles')]
  }
};

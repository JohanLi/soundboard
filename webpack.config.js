const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: {
    app: './src',
  },
  output: {
    path: `${__dirname}/public/`,
    filename: 'app.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
      },
      {
        test: /\.css/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
            },
          }
        ],
      },
      {
        test: /\.woff2/,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  target: 'electron-renderer',
};

if (process.env.NODE_ENV === 'development') {
  config.devServer = {
    contentBase: `${__dirname}/public/`,
  };

  config.devtool = 'cheap-eval-source-map';
}

module.exports = config;

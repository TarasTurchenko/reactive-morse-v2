const path = require('path');

module.exports = {
    entry: './src/index.js',
    target: 'web',
    devtool: 'source-map',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        host: '0.0.0.0',
        publicPath: '/dist/',
        contentBase: path.resolve(__dirname, './src/views/'),
        watchContentBase: true,
        compress: true,
        port: 9001
    }
};

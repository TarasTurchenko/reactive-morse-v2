const path = require('path');

module.exports = {
    entry: './src',
    target: 'web',
    devtool: 'source-map',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './public/dist')
    },
    devServer: {
        host: 'localhost',
        publicPath: '/public/dist/',
        contentBase: path.resolve(__dirname, './public/'),
        watchContentBase: true,
        compress: true,
        port: 8080
    }
}
;

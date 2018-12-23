const path = require('path');

module.exports = {
    entry: './src',
    target: 'web',
    devtool: 'source-map',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './public/dist')
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {loader: 'style-loader'},
                    {
                        loader: 'css-loader',
                        options: {sourceMap: true}
                    },
                    {
                        loader: 'sass-loader', options: {
                            sourceMap: true,
                            data: '@import "variables";',
                            includePaths: [path.join(__dirname, './src/styles')]
                        }
                    }
                ],
                include: path.join(__dirname, './src/styles')
            }
        ]
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

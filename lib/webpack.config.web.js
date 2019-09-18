const path = require('path');
// const webpack = require('webpack');
// const Configuration = webpack.Configuration
// const ExternalsElement = webpack.ExternalsElement

module.exports = {
    target: 'web',
    mode: 'production',
    entry: path.resolve(__dirname, 'index.ts'),
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: `lib.web.slim.js`,
        path: path.resolve(__dirname, 'dist'),
        library: 'lib',
    }
};
const path = require('path');
// const webpack = require('webpack');
// const Configuration = webpack.Configuration
// const ExternalsElement = webpack.ExternalsElement

module.exports = {
    target: "node",
    mode: 'production',
    entry: path.resolve(__dirname, 'index.ts'),
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: [
                    // tsc编译后，再用babel处理
                    // { loader: 'babel-loader', },
                    {
                        loader: 'ts-loader',
                        options: {
                            // 指定特定的ts编译配置，为了区分脚本的ts配置
                            configFile: path.resolve(__dirname, './tsconfig.json')
                        }
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.json', '.ts', '.js']
    },
    output: {
        filename: 'lib.slim.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'commonjs',
    }
};
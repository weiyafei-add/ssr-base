const webpack = require('webpack');
const baseWebpackConfig = require('./webpack.base');
const { merge } = require('webpack-merge');
const { clientName, serverName } = require('../static');
const { resolveEntry, webpackConfig } = require('../resolveConfig'); // webpackConfig: 业务线配置
const getRules = require('./getRules');
const nodeExternals = require('webpack-node-externals');

const clientConfig = merge(baseWebpackConfig, {
    mode: 'development',
    entry: { [clientName]: resolveEntry('core-js') },
    devtool: 'eval-source-map',
    module: {
        rules: getRules()
    },
    optimization: {
        minimize: false, // 不使用默认压缩
        moduleIds: 'deterministic',
        chunkIds: 'deterministic'
    },
    plugins: [
    ]
})

const serverConfig = merge(baseWebpackConfig, {
    mode: 'development',
    entry: { [serverName]: resolveEntry() },
    devtool: 'eval-source-map',
    output: {
        filename: `${serverName}.js`,
        libraryTarget: 'commonjs2',
    },
    node: {
        __dirname: true,
        __filename: true,
    },
    optimization: {
        minimize: false,
    },
    target: 'node',
    externals: [nodeExternals()],
    module: {
        rules: getRules('node')
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify('development'),
            "process.env.WEB": JSON.stringify(false),
        })
    ]
})

if (typeof webpackConfig === 'function') {
    webpackConfig(clientConfig);
    webpackConfig(serverConfig);
}

exports.clientConfig = clientConfig;
exports.serverConfig = serverConfig;

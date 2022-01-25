const { webStyleConfig, nodeStyleConfig } = require('./styleConfig');
const getBabelConfig = require('../babel');

module.exports = function (target = 'web') {
    const rules = [
        {
            test: /\.(ts|tsx|js|jsx)?$/,
            use: [
                {
                    loader: 'babel-loader',
                    options: getBabelConfig(target)
                }
            ],
            exclude: /node_modules/,
        },
        {
            test: /\.(png|jpe?g|gif|svg|mp3)(\?.*)?$/,
            loader: 'file-loader',
            options: {
                name: process.env.NODE_ENV === 'production' ? 'img/[name]_[hash].[ext]' : 'img/[name].[ext]',
                emitFile: target === 'web',
            }
        }
    ]

    return rules.concat(target === 'web' ? webStyleConfig : nodeStyleConfig)
}
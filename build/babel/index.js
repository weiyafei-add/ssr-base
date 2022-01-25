const path = require('path');
const { cssModules, browsers, babelConfig } = require('../resolveConfig'); //babelConfig 业务端配置

module.exports = function (target = 'web') {

    const presets = ["@babel/preset-react", "@babel/preset-typescript"];
    const plugins = [
        "@babel/plugin-proposal-class-properties"
    ];

    if (target === 'web') {
        presets.push([
            "babel/preset-env",
            {
                targets: {
                    browsers,
                }
            }
        ]);
        plugins.push("@babel/plugin-transform-runtime", [path.resolve(__dirname, './')])
    }
}